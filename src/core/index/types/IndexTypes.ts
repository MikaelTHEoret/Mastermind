export interface IndexNode {
  id: number;
  type: string;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
  created_at?: Date;
}

export interface IndexRelation {
  id: number;
  source_id: number;
  target_id: number;
  relation_type: string;
  weight: number;
  metadata?: Record<string, unknown>;
  created_at?: Date;
}

export interface IndexVector {
  id: number;
  node_id: number;
  vector: number[];
  created_at?: Date;
}

export interface SearchOptions {
  limit?: number;
  threshold?: number;
  types?: string[];
}

export interface ClassificationResult {
  categories: string[];
  confidence: number;
  metadata?: Record<string, unknown>;
}