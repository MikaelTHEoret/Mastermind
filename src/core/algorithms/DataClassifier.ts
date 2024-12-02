import { VectorDatabaseManager } from '../database/VectorDatabaseManager';

export class DataClassifier {
  private vectorDB: VectorDatabaseManager;
  private patterns: Map<string, RegExp> = new Map([
    ['email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/],
    ['url', /^(https?:\/\/)?[\w-]+(\.[\w-]+)+[/#?]?.*$/],
    ['code', /^(import|export|class|function|const|let|var)\s/],
    ['json', /^[\[{].*[\]}]$/],
    ['date', /^\d{4}-\d{2}-\d{2}/],
  ]);

  constructor(vectorDB: VectorDatabaseManager) {
    this.vectorDB = vectorDB;
    this.initializePatterns();
  }

  private initializePatterns() {
    // Add more patterns based on historical data
    this.patterns.set('sql', /^(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/i);
    this.patterns.set('markdown', /^#\s|^\*\*|^-\s/);
    this.patterns.set('path', /^(\/|\.\/|\.\.\/).+/);
  }

  async classifyData(data: string): Promise<{
    type: string;
    confidence: number;
    metadata: any;
  }> {
    // First try pattern matching
    for (const [type, pattern] of this.patterns.entries()) {
      if (pattern.test(data)) {
        return {
          type,
          confidence: 0.9,
          metadata: { matchedPattern: true }
        };
      }
    }

    // If no pattern match, use vector similarity
    const embedding = await this.vectorDB.getEmbedding(data);
    const similar = await this.vectorDB.searchSimilar(embedding, 5);

    if (similar.length > 0) {
      // Calculate confidence based on similarity scores
      const avgConfidence = similar.reduce((acc, curr) => acc + curr.similarity, 0) / similar.length;
      
      return {
        type: this.determineType(similar),
        confidence: avgConfidence,
        metadata: { similarDocs: similar.length }
      };
    }

    return {
      type: 'unknown',
      confidence: 0.1,
      metadata: { requiresLLM: true }
    };
  }

  private determineType(similarDocs: any[]): string {
    // Count type occurrences
    const typeCounts = similarDocs.reduce((acc, doc) => {
      const type = doc.metadata.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Return most common type
    return Object.entries(typeCounts)
      .sort(([,a], [,b]) => b - a)[0][0];
  }
}