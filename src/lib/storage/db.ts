import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface AIAssistantDB extends DBSchema {
  dataFlux: {
    key: string;
    value: {
      id: string;
      type: string;
      content: any;
      timestamp: number;
      processed: boolean;
    };
    indexes: { 'by-timestamp': number };
  };
  knowledge: {
    key: string;
    value: {
      id: string;
      topic: string;
      content: any;
      timestamp: number;
      metadata: Record<string, any>;
    };
    indexes: { 'by-topic': string };
  };
  metrics: {
    key: string;
    value: {
      id: string;
      type: string;
      value: number;
      timestamp: number;
    };
    indexes: { 'by-type': string };
  };
}

class StorageManager {
  private db: IDBPDatabase<AIAssistantDB> | null = null;

  async initialize() {
    this.db = await openDB<AIAssistantDB>('ai-assistant', 1, {
      upgrade(db) {
        // DataFlux store
        const dataFluxStore = db.createObjectStore('dataFlux', {
          keyPath: 'id',
        });
        dataFluxStore.createIndex('by-timestamp', 'timestamp');

        // Knowledge store
        const knowledgeStore = db.createObjectStore('knowledge', {
          keyPath: 'id',
        });
        knowledgeStore.createIndex('by-topic', 'topic');

        // Metrics store
        const metricsStore = db.createObjectStore('metrics', {
          keyPath: 'id',
        });
        metricsStore.createIndex('by-type', 'type');
      },
    });
  }

  async storeDataFlux(data: any) {
    if (!this.db) await this.initialize();
    
    const entry = {
      id: crypto.randomUUID(),
      type: data.type,
      content: data,
      timestamp: Date.now(),
      processed: false,
    };

    await this.db!.add('dataFlux', entry);
    return entry;
  }

  async storeKnowledge(topic: string, content: any, metadata: Record<string, any> = {}) {
    if (!this.db) await this.initialize();
    
    const entry = {
      id: crypto.randomUUID(),
      topic,
      content,
      timestamp: Date.now(),
      metadata,
    };

    await this.db!.add('knowledge', entry);
    return entry;
  }

  async storeMetric(type: string, value: number) {
    if (!this.db) await this.initialize();
    
    const entry = {
      id: crypto.randomUUID(),
      type,
      value,
      timestamp: Date.now(),
    };

    await this.db!.add('metrics', entry);
    return entry;
  }

  async queryKnowledge(topic: string) {
    if (!this.db) await this.initialize();
    
    const index = this.db!.transaction('knowledge').store.index('by-topic');
    return await index.getAll(topic);
  }

  async getRecentDataFlux(limit: number = 100) {
    if (!this.db) await this.initialize();
    
    const index = this.db!.transaction('dataFlux').store.index('by-timestamp');
    return await index.getAll(null, limit);
  }

  async getMetricsByType(type: string, since: number) {
    if (!this.db) await this.initialize();
    
    const index = this.db!.transaction('metrics').store.index('by-type');
    const metrics = await index.getAll(type);
    return metrics.filter(m => m.timestamp >= since);
  }
}

export const storageManager = new StorageManager();