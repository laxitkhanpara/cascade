import { config } from "dotenv";
import { resolve } from "node:path";
import neo4j from "neo4j-driver";
import {
  assembledFrom,
  cities,
  components,
  contains,
  factories,
  products,
  suppliedBy,
  suppliers,
} from "./graph-data";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const uri = process.env.COGNODB_URI;
const password = process.env.COGNODB_PASSWORD;
const user = process.env.COGNODB_USER || "cognodb";

if (!uri || !password) {
  console.error(
    "Missing COGNODB_URI or COGNODB_PASSWORD. Copy .env.example to .env.local first.",
  );
  process.exit(1);
}

const dbUri: string = uri;
const dbPassword: string = password;

async function main() {
  const driver = neo4j.driver(dbUri, neo4j.auth.basic(user, dbPassword));
  const session = driver.session();

  try {
    await session.executeWrite(async (tx) => {
      await tx.run("MATCH (n) DETACH DELETE n");

      await tx.run(
        `
        UNWIND $rows AS row
        MERGE (c:City {id: row.id})
        SET c.name = row.name, c.country = row.country, c.hazard = row.hazard
        `,
        { rows: cities },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MATCH (city:City {id: row.cityId})
        MERGE (f:Factory {id: row.id})
        SET f.name = row.name
        MERGE (f)-[:LOCATED_IN]->(city)
        `,
        { rows: factories },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MATCH (f:Factory {id: row.factoryId})
        MERGE (s:Supplier {id: row.id})
        SET s.name = row.name, s.tier = row.tier
        MERGE (s)-[:OPERATES]->(f)
        `,
        { rows: suppliers },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MERGE (c:Component {id: row.id})
        SET c.name = row.name, c.category = row.category, c.criticality = row.criticality
        `,
        { rows: components },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MATCH (c:Component {id: row.componentId})
        MATCH (s:Supplier {id: row.supplierId})
        MERGE (c)-[r:SUPPLIED_BY]->(s)
        SET r.leadDays = row.leadDays, r.soleSource = row.soleSource
        `,
        { rows: suppliedBy },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MATCH (parent:Component {id: row.parent})
        MATCH (child:Component {id: row.child})
        MERGE (parent)-[r:CONTAINS]->(child)
        SET r.qty = row.qty
        `,
        { rows: contains },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MERGE (p:Product {id: row.id})
        SET p.name = row.name, p.category = row.category, p.asp = row.asp
        `,
        { rows: products },
      );

      await tx.run(
        `
        UNWIND $rows AS row
        MATCH (p:Product {id: row.productId})
        MATCH (c:Component {id: row.componentId})
        MERGE (p)-[r:ASSEMBLED_FROM]->(c)
        SET r.qty = row.qty
        `,
        { rows: assembledFrom },
      );
    });

    const counts = await session.executeRead(async (tx) => {
      const result = await tx.run(`
        MATCH (n)
        WITH labels(n)[0] AS label, count(*) AS n
        RETURN label, n
        ORDER BY label
      `);
      return result.records.map((record) => ({
        label: record.get("label") as string,
        n: record.get("n").toNumber?.() ?? record.get("n"),
      }));
    });

    const rels = await session.executeRead(async (tx) => {
      const result = await tx.run(`MATCH ()-[r]->() RETURN count(r) AS n`);
      return result.records[0].get("n").toNumber?.() ?? result.records[0].get("n");
    });

    console.log("Seeded Helios supply graph:");
    for (const row of counts) {
      console.log(`  ${row.label}: ${row.n}`);
    }
    console.log(`  relationships: ${rels}`);
    console.log("Demo: simulate a tornado in Harrodsburg (cover glass) or a typhoon in Tainan (SoCs).");
  } finally {
    await session.close();
    await driver.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
