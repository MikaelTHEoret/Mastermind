import { LLMManager } from '../LLMManager';
import { ClassificationResult } from './types/IndexTypes';

export class IndexClassifier {
  constructor(private llm: LLMManager) {}

  async classify(entity: any): Promise<string[]> {
    const analysis = await this.llm.processCommand(`
      Analyze and classify this entity:
      ${JSON.stringify(entity)}
      
      Return a JSON array of classification categories, from most general to most specific.
      Consider:
      1. Entity type
      2. Properties
      3. Behavior
      4. Relations
      5. Context
    `);

    try {
      const result: ClassificationResult = JSON.parse(analysis);
      return result.categories;
    } catch (error) {
      throw new Error('Failed to parse classification result');
    }
  }

  async suggestRelations(entity: any): Promise<Array<{ type: string; target: string; confidence: number }>> {
    const analysis = await this.llm.processCommand(`
      Analyze this entity and suggest possible relations:
      ${JSON.stringify(entity)}
      
      Return a JSON array of relation suggestions with:
      1. Relation type
      2. Target entity type
      3. Confidence score
    `);

    return JSON.parse(analysis);
  }
}