import { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { DatabaseConfig } from '../../types';

export class VectorDatabaseManager {
  private client: MilvusClient | null = null;
  private collection: string = 'mastermind_vectors';
  private dimension: number = 1536; // OpenAI embeddings dimension

  async connect(config: DatabaseConfig): Promise<boolean> {
    try {
      this.client = new MilvusClient({
        address: config.url || 'localhost:19530',
        username: config.username,
        password: config.password,
      });

      await this.initializeCollection();
      return true;
    } catch (error) {
      console.error('Failed to connect to Milvus:', error);
      return false;
    }
  }

  private async initializeCollection(): Promise<void> {
    if (!this.client) return;

    const collections = await this.client.listCollections();
    const exists = collections.some(c => c.name === this.collection);

    if (!exists) {
      await this.client.createCollection({
        collection_name: this.collection,
        dimension: this.dimension,
        metric_type: 'L2',
      });
    }

    await this.client.loadCollection({
      collection_name: this.collection,
    });
  }

  async insertVector(vector: number[], metadata: any): Promise<string> {
    if (!this.client) throw new Error('Not connected to Milvus');

    const result = await this.client.insert({
      collection_name: this.collection,
      data: [{
        vector,
        metadata: JSON.stringify(metadata),
      }],
    });

    return result.primary_keys[0].toString();
  }

  async searchSimilar(vector: number[], limit: number = 5): Promise<any[]> {
    if (!this.client) throw new Error('Not connected to Milvus');

    const result = await this.client.search({
      collection_name: this.collection,
      vector,
      limit,
      output_fields: ['metadata'],
    });

    return result.results.map(r => ({
      ...JSON.parse(r.metadata),
      similarity: r.score,
    }));
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.closeConnection();
      this.client = null;
    }
  }
}