import { queryLLM } from '../../utils/llm';
import { executeCommand } from '../../utils/executor';
import { ModuleSystem } from '../module/ModuleSystem';
import { WorkerPool } from '../worker/WorkerPool';
import { KnowledgeBase } from '../knowledge/KnowledgeBase';

export class CommandProcessor {
  constructor(
    private moduleSystem: ModuleSystem,
    private workerPool: WorkerPool,
    private knowledgeBase: KnowledgeBase,
    private onResponse: (text: string) => void
  ) {}

  async processCommand(command: string) {
    try {
      const interpretation = await queryLLM(`
        Interpret the following command for Mastermind:
        ${command}
        
        Return a structured response with:
        - Target system component
        - Action to perform
        - Parameters
      `);

      const { component, action, parameters } = JSON.parse(interpretation);

      const result = await this.routeCommand(component, action, parameters);
      this.onResponse(`Command executed successfully: ${result}`);
      return result;
    } catch (error) {
      const errorMessage = `Error processing command: ${error.message}`;
      this.onResponse(errorMessage);
      return errorMessage;
    }
  }

  private async routeCommand(component: string, action: string, parameters: any) {
    switch (component) {
      case 'module':
        return this.moduleSystem.handleCommand(action, parameters);
      case 'worker':
        return this.workerPool.executeTask(action, parameters);
      case 'knowledge':
        return this.knowledgeBase.query(action, parameters);
      default:
        return executeCommand(action, parameters);
    }
  }
}