import { DatabaseConnection, ConnectionConfig } from './types/DatabaseTypes';
import { SQLiteConnection } from './connections/SQLiteConnection';
import fs from 'fs/promises';
import path from 'path';

export class DatabaseInitializer {
  private static readonly MIGRATIONS_PATH = path.join(__dirname, 'migrations');

  static async initialize(config: ConnectionConfig): Promise<DatabaseConnection> {
    const connection = new SQLiteConnection(config);
    await connection.connect();
    
    // Run migrations
    await this.runMigrations(connection);
    
    return connection;
  }

  private static async runMigrations(connection: DatabaseConnection): Promise<void> {
    try {
      const schema = await fs.readFile(
        path.join(this.MIGRATIONS_PATH, 'schema.sql'),
        'utf-8'
      );

      const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      for (const statement of statements) {
        await connection.query(statement);
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to run migrations: ${error.message}`);
      }
      throw new Error('Failed to run migrations: Unknown error');
    }
  }
}