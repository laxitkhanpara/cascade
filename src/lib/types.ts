export type NodeType = "Product" | "Component" | "Supplier" | "Factory" | "City";

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  affected: boolean;
  subtitle?: string;
};

export type GraphEdge = {
  id: string;
  source: string;
  target: string;
  type: string;
};

export type GraphPayload = {
  nodes: GraphNode[];
  edges: GraphEdge[];
};

export type OverviewStats = {
  products: number;
  components: number;
  suppliers: number;
  factories: number;
  cities: number;
  soleSourceParts: number;
};

export type CityRisk = {
  id: string;
  name: string;
  country: string;
  hazard: string;
  factories: number;
  productsAtRisk: number;
};

export type ProductSummary = {
  id: string;
  name: string;
  category: string;
  asp: number;
  cityCount: number;
  soleSourceCount: number;
};

export type OverviewResponse = {
  stats: OverviewStats;
  cities: CityRisk[];
  products: ProductSummary[];
};

export type TargetOption = {
  id: string;
  name: string;
  extra?: string;
};

export type TargetsResponse = {
  cities: TargetOption[];
  factories: TargetOption[];
  suppliers: TargetOption[];
};

export type AffectedProduct = {
  id: string;
  name: string;
  category: string;
  asp: number;
  hitParts: string[];
  soleSourceHits: number;
};

export type SimulateResponse = {
  target: { type: string; id: string; name: string; extra?: string };
  summary: {
    products: number;
    parts: number;
    suppliers: number;
    factories: number;
  };
  products: AffectedProduct[];
  graph: GraphPayload;
};

export type ChokePoint = {
  id: string;
  name: string;
  category: string;
  criticality: string;
  supplier: string;
  city: string;
  country: string;
  hazard: string;
  products: string[];
};

export type ProductDetail = {
  id: string;
  name: string;
  category: string;
  asp: number;
  cities: {
    id: string;
    name: string;
    country: string;
    hazard: string;
    parts: string[];
  }[];
  soleSourceParts: {
    id: string;
    name: string;
    supplier: string;
    city: string;
  }[];
  graph: GraphPayload;
};
