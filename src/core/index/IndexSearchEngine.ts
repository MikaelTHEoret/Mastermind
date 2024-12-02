import { VectorDatabaseManager } from '../database/VectorDatabaseManager';
import { IndexNode, SearchOptions } from './types/IndexTypes';

export class IndexSearchEngine {
  constructor(private vectorDb: VectorDatabaseManager) {}

  async search(query: string, options: SearchOptions = {}): Promise<IndexNode[]> {
    const { limit = 10, threshold = 0.7 } = options;
    
    const queryVector = await this.generateVector(query);
    const results = await this.vectorDb.searchSimilar(queryVector, limit);

    return results
      .filter(r => r.similarity >= threshold)
      .map(r => ({
        id: r.id,
        type: r.type,
        name: r.name,
        description: r.description,
        metadata: r.metadata
      }));
  }

  async generateVector(content: string): Promise<number[]> {
    // Simple vector generation for demonstration
    // In a real implementation, this would use a proper embedding model
    return Array.from(content).map(char => char.charCodeAt(0) / 255);
  }
}