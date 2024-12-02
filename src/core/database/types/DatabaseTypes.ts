export interface DatabaseConnection {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T>;
  isConnected(): boolean;
}

export interface ConnectionConfig {
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  database?: string;
  filename?: string;
}

export interface DatabaseMetrics {
  connectionCount: number;
  activeQueries: number;
  lastQuery: string;
  uptime: number;
}

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
  duration: number;
}