export type DatabaseType = 'mongodb' | 'redis' | 'postgresql' | 'sqlite' | 'milvus';

export interface DatabaseConfig {
  url?: string;
  path?: string;
  username?: string;
  password?: string;
  database?: string;
}

export interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  context?: string;
  source: string;
}

export interface InteractionEntry {
  timestamp: Date;
  type: string;
  content: string;
  response: string;
  success: boolean;
  metadata?: string;
}

export interface VectorEntry {
  vector: number[];
  metadata: any;
}