import Database from 'better-sqlite3';
import { DatabaseConnection, ConnectionConfig, QueryResult } from '../types/DatabaseTypes';

export class SQLiteConnection implements DatabaseConnection {
  private db: Database.Database | null = null;
  private config: ConnectionConfig;

  constructor(config: ConnectionConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (!this.config.filename) {
      throw new Error('SQLite connection requires a filename');
    }

    try {
      this.db = new Database(this.config.filename);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to connect to SQLite: ${error.message}`);
      }
      throw new Error('Failed to connect to SQLite: Unknown error');
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  async query<T>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (!this.db) {
      throw new Error('Database not connected');
    }

    const startTime = Date.now();
    try {
      const stmt = this.db.prepare(sql);
      const rows = stmt.all(params) as T[];
      
      return {
        rows,
        rowCount: rows.length,
        duration: Date.now() - startTime
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Query failed: ${error.message}`);
      }
      throw new Error('Query failed: Unknown error');
    }
  }

  isConnected(): boolean {
    return this.db !== null;
  }
}