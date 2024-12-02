```typescript
import { LLMManager } from '../LLMManager';

export abstract class BaseAgent {
  constructor(protected llm: LLMManager) {}

  abstract generateInsights(): Promise<any>;

  protected async validateWithLLM(data: any, context: string): Promise<boolean> {
    const validation = await this.llm.processCommand(`
      Validate this ${context}:
      ${JSON.stringify(data)}
      
      Return true if valid, false otherwise with reason.
    `);

    return JSON.parse(validation).valid;
  }

  protected async explainDecision(decision: any): Promise<string> {
    const explanation = await this.llm.processCommand(`
      Explain this decision:
      ${JSON.stringify(decision)}
      
      Provide a clear, concise explanation.
    `);

    return explanation;
  }
}
```