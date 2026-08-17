import { readQuery } from "@/lib/neo4j";
import type {
  AffectedProduct,
  ChokePoint,
  CityRisk,
  GraphEdge,
  GraphNode,
  GraphPayload,
  NodeType,
  OverviewResponse,
  ProductDetail,
  ProductSummary,
  SimulateResponse,
  TargetOption,
} from "@/lib/types";

type ChainRow = {
  product: { id: string; name: string; category: string; asp: number };
  part: { id: string; name: string; category: string; criticality: string };
  supplier: { id: string; name: string; tier: number };
  factory: { id: string; name: string };
  city: { id: string; name: string; country: string; hazard: string };
  chain: { id: string; name: string; kind: string }[];
  soleSource: boolean;
};

function addNode(
  map: Map<string, GraphNode>,
  id: string,
  label: string,
  type: NodeType,
  subtitle?: string,
) {
  if (!map.has(id)) {
    map.set(id, { id, label, type, affected: true, subtitle });
  }
}

function addEdge(
  map: Map<string, GraphEdge>,
  source: string,
  target: string,
  type: string,
) {
  const id = `${source}->${target}:${type}`;
  if (!map.has(id)) {
    map.set(id, { id, source, target, type });
  }
}

function graphFromRows(rows: ChainRow[]): GraphPayload {
  const nodes = new Map<string, GraphNode>();
  const edges = new Map<string, GraphEdge>();

  for (const row of rows) {
    addNode(
      nodes,
      row.city.id,
      row.city.name,
      "City",
      `${row.city.country} · ${row.city.hazard}`,
    );
    addNode(nodes, row.factory.id, row.factory.name, "Factory", row.city.name);
    addNode(
      nodes,
      row.supplier.id,
      row.supplier.name,
      "Supplier",
      `Tier ${row.supplier.tier}`,
    );
    addNode(
      nodes,
      row.part.id,
      row.part.name,
      "Component",
      row.part.criticality,
    );
    addNode(
      nodes,
      row.product.id,
      row.product.name,
      "Product",
      row.product.category,
    );

    addEdge(edges, row.city.id, row.factory.id, "SHOCK");
    addEdge(edges, row.factory.id, row.supplier.id, "SHOCK");
    addEdge(edges, row.supplier.id, row.part.id, "SHOCK");

    const chain = row.chain ?? [];
    for (let i = chain.length - 1; i > 0; i -= 1) {
      const child = chain[i];
      const parent = chain[i - 1];
      addNode(
        nodes,
        child.id,
        child.name,
        child.kind === "Product" ? "Product" : "Component",
      );
      addNode(
        nodes,
        parent.id,
        parent.name,
        parent.kind === "Product" ? "Product" : "Component",
      );
      addEdge(edges, child.id, parent.id, "SHOCK");
    }
  }

  return { nodes: [...nodes.values()], edges: [...edges.values()] };
}

function productsFromRows(rows: ChainRow[]): AffectedProduct[] {
  const byId = new Map<string, AffectedProduct>();
  for (const row of rows) {
    const existing = byId.get(row.product.id);
    if (!existing) {
      byId.set(row.product.id, {
        id: row.product.id,
        name: row.product.name,
        category: row.product.category,
        asp: row.product.asp,
        hitParts: [row.part.name],
        soleSourceHits: row.soleSource ? 1 : 0,
      });
    } else {
      if (!existing.hitParts.includes(row.part.name)) {
        existing.hitParts.push(row.part.name);
      }
      if (row.soleSource) existing.soleSourceHits += 1;
    }
  }
  return [...byId.values()].sort((a, b) => b.soleSourceHits - a.soleSourceHits);
}

const CHAIN_RETURN = `
  product { .id, .name, .category, .asp } AS product,
  part { .id, .name, .category, .criticality } AS part,
  supplier { .id, .name, .tier } AS supplier,
  factory { .id, .name } AS factory,
  city { .id, .name, .country, .hazard } AS city,
  [n IN nodes(path) | { id: n.id, name: n.name, kind: labels(n)[0] }] AS chain,
  coalesce(sb.soleSource, false) AS soleSource
`;

export async function pingDatabase(): Promise<boolean> {
  const rows = await readQuery<{ ok: number }>("RETURN 1 AS ok");
  return rows[0]?.ok === 1;
}

export async function getOverview(): Promise<OverviewResponse> {
  const [statsRows, cityRows, productRows] = await Promise.all([
    readQuery<{
      products: number;
      components: number;
      suppliers: number;
      factories: number;
      cities: number;
      soleSourceParts: number;
    }>(`
      MATCH (p:Product)
      WITH count(p) AS products
      MATCH (c:Component)
      WITH products, count(c) AS components
      MATCH (s:Supplier)
      WITH products, components, count(s) AS suppliers
      MATCH (f:Factory)
      WITH products, components, suppliers, count(f) AS factories
      MATCH (city:City)
      WITH products, components, suppliers, factories, count(city) AS cities
      MATCH (part:Component)
      OPTIONAL MATCH (part)-[:SUPPLIED_BY]->(sup:Supplier)
      WITH products, components, suppliers, factories, cities, part, count(sup) AS supplierCount
      WITH products, components, suppliers, factories, cities,
           sum(CASE WHEN supplierCount = 1 THEN 1 ELSE 0 END) AS soleSourceParts
      RETURN products, components, suppliers, factories, cities, soleSourceParts
    `),
    readQuery<CityRisk>(`
      MATCH (city:City)
      OPTIONAL MATCH (city)<-[:LOCATED_IN]-(f:Factory)
                <-[:OPERATES]-(s:Supplier)
                <-[:SUPPLIED_BY]-(part:Component)
      OPTIONAL MATCH (prod:Product)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(part)
      RETURN city.id AS id,
             city.name AS name,
             city.country AS country,
             city.hazard AS hazard,
             count(DISTINCT f) AS factories,
             count(DISTINCT prod) AS productsAtRisk
      ORDER BY productsAtRisk DESC, name
    `),
    readQuery<ProductSummary>(`
      MATCH (p:Product)
      OPTIONAL MATCH (p)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(part:Component)
      OPTIONAL MATCH (part)-[:SUPPLIED_BY]->(:Supplier)-[:OPERATES]->(:Factory)-[:LOCATED_IN]->(city:City)
      WITH p, collect(DISTINCT part) AS parts, collect(DISTINCT city) AS cities
      UNWIND (CASE WHEN size(parts) = 0 THEN [null] ELSE parts END) AS part
      OPTIONAL MATCH (part)-[:SUPPLIED_BY]->(sup:Supplier)
      WITH p, cities, part, count(sup) AS supplierCount
      RETURN p.id AS id,
             p.name AS name,
             p.category AS category,
             p.asp AS asp,
             size([c IN cities WHERE c IS NOT NULL]) AS cityCount,
             sum(CASE WHEN part IS NOT NULL AND supplierCount = 1 THEN 1 ELSE 0 END) AS soleSourceCount
      ORDER BY soleSourceCount DESC, name
    `),
  ]);

  const stats = statsRows[0] ?? {
    products: 0,
    components: 0,
    suppliers: 0,
    factories: 0,
    cities: 0,
    soleSourceParts: 0,
  };

  return { stats, cities: cityRows, products: productRows };
}

export async function getTargets(): Promise<{
  cities: TargetOption[];
  factories: TargetOption[];
  suppliers: TargetOption[];
}> {
  const [cities, factories, suppliers] = await Promise.all([
    readQuery<TargetOption>(`
      MATCH (c:City)
      RETURN c.id AS id, c.name AS name, c.country + ' - ' + c.hazard AS extra
      ORDER BY c.name
    `),
    readQuery<TargetOption>(`
      MATCH (f:Factory)-[:LOCATED_IN]->(c:City)
      RETURN f.id AS id, f.name AS name, c.name AS extra
      ORDER BY f.name
    `),
    readQuery<TargetOption>(`
      MATCH (s:Supplier)-[:OPERATES]->(f:Factory)-[:LOCATED_IN]->(c:City)
      RETURN s.id AS id, s.name AS name, c.name AS extra
      ORDER BY s.name
    `),
  ]);
  return { cities, factories, suppliers };
}

export async function simulateDisruption(
  targetType: "city" | "factory" | "supplier",
  targetId: string,
): Promise<SimulateResponse> {
  let rows: ChainRow[] = [];
  let targetName = targetId;
  let extra: string | undefined;

  if (targetType === "city") {
    rows = await readQuery<ChainRow>(
      `
      MATCH (city:City {id: $targetId})<-[:LOCATED_IN]-(factory:Factory)
            <-[:OPERATES]-(supplier:Supplier)
            <-[sb:SUPPLIED_BY]-(part:Component)
      MATCH path = (product:Product)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(part)
      RETURN ${CHAIN_RETURN}
      `,
      { targetId },
    );
    extra = rows[0]?.city.country;
    targetName = rows[0]?.city.name ?? targetId;
  } else if (targetType === "factory") {
    rows = await readQuery<ChainRow>(
      `
      MATCH (factory:Factory {id: $targetId})-[:LOCATED_IN]->(city:City)
      MATCH (factory)<-[:OPERATES]-(supplier:Supplier)
            <-[sb:SUPPLIED_BY]-(part:Component)
      MATCH path = (product:Product)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(part)
      RETURN ${CHAIN_RETURN}
      `,
      { targetId },
    );
    extra = rows[0]?.city.name;
    targetName = rows[0]?.factory.name ?? targetId;
  } else {
    rows = await readQuery<ChainRow>(
      `
      MATCH (supplier:Supplier {id: $targetId})-[:OPERATES]->(factory:Factory)
            -[:LOCATED_IN]->(city:City)
      MATCH (supplier)<-[sb:SUPPLIED_BY]-(part:Component)
      MATCH path = (product:Product)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(part)
      RETURN ${CHAIN_RETURN}
      `,
      { targetId },
    );
    extra = rows[0]?.city.name;
    targetName = rows[0]?.supplier.name ?? targetId;
  }

  const products = productsFromRows(rows);
  const graph = graphFromRows(rows);
  const partIds = new Set(rows.map((row) => row.part.id));
  const supplierIds = new Set(rows.map((row) => row.supplier.id));
  const factoryIds = new Set(rows.map((row) => row.factory.id));

  return {
    target: { type: targetType, id: targetId, name: targetName, extra },
    summary: {
      products: products.length,
      parts: partIds.size,
      suppliers: supplierIds.size,
      factories: factoryIds.size,
    },
    products,
    graph,
  };
}

export async function getChokePoints(): Promise<ChokePoint[]> {
  return readQuery<ChokePoint>(`
    MATCH (c:Component)-[:SUPPLIED_BY]->(s:Supplier)
    WITH c, collect(s) AS suppliers
    WHERE size(suppliers) = 1
    MATCH (c)-[:SUPPLIED_BY]->(s:Supplier)-[:OPERATES]->(f:Factory)-[:LOCATED_IN]->(city:City)
    OPTIONAL MATCH (p:Product)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(c)
    RETURN c.id AS id,
           c.name AS name,
           c.category AS category,
           c.criticality AS criticality,
           s.name AS supplier,
           city.name AS city,
           city.country AS country,
           city.hazard AS hazard,
           [name IN collect(DISTINCT p.name) WHERE name IS NOT NULL] AS products
    ORDER BY size(products) DESC, name
  `);
}

export async function getProductDetail(id: string): Promise<ProductDetail | null> {
  const header = await readQuery<{
    id: string;
    name: string;
    category: string;
    asp: number;
  }>(
    `
    MATCH (p:Product {id: $id})
    RETURN p.id AS id, p.name AS name, p.category AS category, p.asp AS asp
    `,
    { id },
  );
  if (!header[0]) return null;

  const rows = await readQuery<ChainRow>(
    `
    MATCH (product:Product {id: $id})
    MATCH path = (product)-[:ASSEMBLED_FROM|CONTAINS*1..8]->(part:Component)
    MATCH (part)-[sb:SUPPLIED_BY]->(supplier:Supplier)
          -[:OPERATES]->(factory:Factory)
          -[:LOCATED_IN]->(city:City)
    RETURN ${CHAIN_RETURN}
    `,
    { id },
  );

  const cities = new Map<
    string,
    ProductDetail["cities"][number]
  >();
  const sole = new Map<string, ProductDetail["soleSourceParts"][number]>();

  for (const row of rows) {
    const city = cities.get(row.city.id) ?? {
      id: row.city.id,
      name: row.city.name,
      country: row.city.country,
      hazard: row.city.hazard,
      parts: [],
    };
    if (!city.parts.includes(row.part.name)) city.parts.push(row.part.name);
    cities.set(row.city.id, city);

    if (row.soleSource && !sole.has(row.part.id)) {
      sole.set(row.part.id, {
        id: row.part.id,
        name: row.part.name,
        supplier: row.supplier.name,
        city: row.city.name,
      });
    }
  }

  return {
    ...header[0],
    cities: [...cities.values()].sort((a, b) => b.parts.length - a.parts.length),
    soleSourceParts: [...sole.values()],
    graph: graphFromRows(rows),
  };
}
