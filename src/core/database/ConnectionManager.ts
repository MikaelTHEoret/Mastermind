import { DatabaseConnection, ConnectionConfig, DatabaseMetrics } from './types/DatabaseTypes';
import { DatabaseInitializer } from './DatabaseInitializer';
import { EventEmitter } from 'events';

export class ConnectionManager extends EventEmitter {
  private connections: Map<string, DatabaseConnection> = new Map();
  private metrics: Map<string, DatabaseMetrics> = new Map();
  private startTime: number = Date.now();

  async createConnection(name: string, config: ConnectionConfig): Promise<void> {
    if (this.connections.has(name)) {
      throw new Error(`Connection '${name}' already exists`);
    }

    try {
      const connection = await DatabaseInitializer.initialize(config);
      this.connections.set(name, connection);
      
      this.metrics.set(name, {
        connectionCount: 1,
        activeQueries: 0,
        lastQuery: '',
        uptime: 0
      });

      this.emit('connection:created', { name });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create connection '${name}': ${error.message}`);
      }
      throw new Error(`Failed to create connection '${name}': Unknown error`);
    }
  }

  async closeConnection(name: string): Promise<void> {
    const connection = this.connections.get(name);
    if (!connection) {
      throw new Error(`Connection '${name}' not found`);
    }

    try {
      await connection.disconnect();
      this.connections.delete(name);
      this.metrics.delete(name);
      this.emit('connection:closed', { name });
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to close connection '${name}': ${error.message}`);
      }
      throw new Error(`Failed to close connection '${name}': Unknown error`);
    }
  }

  async query<T>(connectionName: string, sql: string, params?: any[]): Promise<T> {
    const connection = this.connections.get(connectionName);
    if (!connection) {
      throw new Error(`Connection '${connectionName}' not found`);
    }

    const metrics = this.metrics.get(connectionName);
    if (metrics) {
      metrics.activeQueries++;
      metrics.lastQuery = sql;
      this.emit('query:started', { connectionName, sql });
    }

    try {
      const result = await connection.query<T>(sql, params);
      this.emit('query:completed', { connectionName, sql });
      return result;
    } catch (error) {
      this.emit('query:error', { connectionName, sql, error });
      throw error;
    } finally {
      if (metrics) {
        metrics.activeQueries--;
      }
    }
  }

  getMetrics(connectionName: string): DatabaseMetrics {
    const metrics = this.metrics.get(connectionName);
    if (!metrics) {
      throw new Error(`No metrics found for connection '${connectionName}'`);
    }

    return {
      ...metrics,
      uptime: Date.now() - this.startTime
    };
  }

  isConnected(connectionName: string): boolean {
    const connection = this.connections.get(connectionName);
    return connection?.isConnected() ?? false;
  }
}