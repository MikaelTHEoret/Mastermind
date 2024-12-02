```typescript
import { LLMManager } from '../LLMManager';
import { ExperienceManager } from '../command/experience/ExperienceManager';
import { BaseAgent } from './BaseAgent';

export class ExperienceAgent extends BaseAgent {
  constructor(
    llm: LLMManager,
    private experience: ExperienceManager
  ) {
    super(llm);
  }

  async analyzeExperienceUpdate(data: any): Promise<void> {
    const analysis = await this.llm.processCommand(`
      Analyze this command experience update:
      ${JSON.stringify(data)}
      
      Consider:
      1. Impact on system stability
      2. User satisfaction indicators
      3. Performance implications
      
      Return a structured analysis.
    `);

    const parsedAnalysis = JSON.parse(analysis);
    
    if (parsedAnalysis.requiresAction) {
      await this.updateExperienceRules(parsedAnalysis);
    }
  }

  private async updateExperienceRules(analysis: any): Promise<void> {
    const ruleUpdates = await this.llm.processCommand(`
      Generate experience rule updates based on:
      ${JSON.stringify(analysis)}
      
      Return specific rule modifications.
    `);

    const updates = JSON.parse(ruleUpdates);
    
    // Apply rule updates
    for (const update of updates) {
      await this.experience.updateExperienceRule(update);
    }
  }

  async generateInsights(): Promise<any> {
    const experiences = await this.experience.getAllExperiences();
    
    const insights = await this.llm.processCommand(`
      Generate insights from these command experiences:
      ${JSON.stringify(experiences)}
      
      Focus on:
      1. Success patterns
      2. Common failure modes
      3. Performance trends
      
      Return structured insights.
    `);

    return JSON.parse(insights);
  }
}
```