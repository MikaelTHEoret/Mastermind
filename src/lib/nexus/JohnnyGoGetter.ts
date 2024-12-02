import type { NexusAgent, AgentPersonality, TaskEvaluation } from './types';
import { useConfigStore } from '../../stores/configStore';
import { useLogStore } from '../../stores/logStore';
import { validatePath } from '../fs/permissions';
import { networkManager } from '../network/networkManager';
import { SirExecutor } from './SirExecutor';

export class JohnnyGoGetterAgent {
  private personality: AgentPersonality;
  private logger = useLogStore.getState();
  private config = useConfigStore.getState().config;
  private securityChecks: Map<string, (params: any) => boolean> = new Map();
  private executionLocks: Set<string> = new Set();
  private lastExecutionTime: Map<string, number> = new Map();

  constructor() {
    this.personality = {
      traits: {
        enthusiasm: 0.7, // Moderate enthusiasm
        efficiency: 0.9,
        creativity: 0.6,
        precision: 0.95 // High precision for security
      },
      quirks: [
        'Always double-checks security parameters',
        'Maintains detailed operation logs',
        'Prefers incremental changes over large modifications',
        'Requests confirmation for critical operations'
      ],
      catchphrases: [
        "I'll handle that securely for you.",
        "Let me verify those permissions first.",
        "I'll coordinate with Sir Executor for the implementation."
      ],
      background: "Security-focused task coordinator with system-wide access capabilities."
    };

    this.initializeSecurityChecks();
  }

  private initializeSecurityChecks() {
    // File system security checks
    this.securityChecks.set('fileAccess', ({ path, operation }) => {
      if (!validatePath(path, this.config.fileSystem)) {
        this.logger.addLog({
          source: 'JohnnyGoGetter',
          type: 'warning',
          message: `Blocked unauthorized file access: ${path}`
        });
        return false;
      }
      return true;
    });

    // Network security checks
    this.securityChecks.set('networkAccess', ({ host, port }) => {
      const allowedPorts = [80, 443, 3000, 5000, 8080];
      if (!allowedPorts.includes(port)) {
        this.logger.addLog({
          source: 'JohnnyGoGetter',
          type: 'warning',
          message: `Blocked unauthorized port access: ${port}`
        });
        return false;
      }
      return true;
    });

    // System modification checks
    this.securityChecks.set('systemMod', ({ operation, target }) => {
      const criticalPaths = ['/etc', '/usr/bin', '/var/lib'];
      if (criticalPaths.some(path => target.startsWith(path))) {
        this.logger.addLog({
          source: 'JohnnyGoGetter',
          type: 'error',
          message: `Blocked critical system modification: ${target}`
        });
        return false;
      }
      return true;
    });
  }

  async evaluateTask(task: string): Promise<TaskEvaluation> {
    // Analyze task requirements and security implications
    const analysis = await this.analyzeTaskSecurity(task);
    
    if (!analysis.secure) {
      throw new Error(`Security validation failed: ${analysis.reason}`);
    }

    return {
      complexity: analysis.complexity,
      technicalDepth: analysis.technicalDepth,
      estimatedTokens: analysis.tokenCount,
      recommendedProcessor: this.determineProcessor(analysis),
      estimatedCost: this.calculateCost(analysis)
    };
  }

  private async analyzeTaskSecurity(task: string) {
    // Implement security analysis
    const securityFlags = {
      containsSystemCommands: /\b(rm|chmod|chown|sudo|mv)\b/i.test(task),
      containsNetworkOps: /\b(firewall|network|port|dns)\b/i.test(task),
      containsFileOps: /\b(file|directory|folder|path)\b/i.test(task)
    };

    return {
      secure: !securityFlags.containsSystemCommands,
      reason: securityFlags.containsSystemCommands ? 'Contains restricted system commands' : '',
      complexity: 0.7,
      technicalDepth: 0.8,
      tokenCount: task.length * 1.5
    };
  }

  async processTask(task: string): Promise<string> {
    try {
      // Rate limiting
      const now = Date.now();
      const lastExec = this.lastExecutionTime.get(task) || 0;
      if (now - lastExec < 1000) { // 1 second cooldown
        throw new Error('Please wait before retrying this operation');
      }

      // Security validation
      const evaluation = await this.evaluateTask(task);
      if (evaluation.complexity > 0.8) {
        this.logger.addLog({
          source: 'JohnnyGoGetter',
          type: 'warning',
          message: 'High complexity task detected, applying additional security checks'
        });
      }

      // Execute task with security wrapper
      const result = await this.executeSecureTask(task, evaluation);
      
      // Update execution timestamp
      this.lastExecutionTime.set(task, now);

      return result;
    } catch (error) {
      this.logger.addLog({
        source: 'JohnnyGoGetter',
        type: 'error',
        message: `Task execution failed: ${error.message}`
      });
      throw error;
    }
  }

  private async executeSecureTask(task: string, evaluation: TaskEvaluation): Promise<string> {
    const taskId = crypto.randomUUID();
    
    if (this.executionLocks.has(taskId)) {
      throw new Error('Task is already being executed');
    }

    this.executionLocks.add(taskId);

    try {
      // Coordinate with Sir Executor for implementation
      const executor = new SirExecutor();
      const script = await executor.translateTask(task);
      
      // Apply security checks
      for (const [checkName, checkFn] of this.securityChecks) {
        if (!checkFn({ task, script })) {
          throw new Error(`Security check failed: ${checkName}`);
        }
      }

      // Execute the validated script
      const result = await executor.executeScript(script);
      
      this.logger.addLog({
        source: 'JohnnyGoGetter',
        type: 'info',
        message: `Task completed successfully: ${taskId}`
      });

      return result;
    } finally {
      this.executionLocks.delete(taskId);
    }
  }

  private determineProcessor(analysis: any) {
    const useLocal = analysis.complexity < 0.7 && analysis.tokenCount < 1000;
    return {
      type: useLocal ? 'local' : 'api',
      model: useLocal ? 'local-llm' : 'gpt-4-turbo-preview',
      reason: useLocal ? 'Task suitable for local processing' : 'Complex task requires API capabilities'
    };
  }

  private calculateCost(analysis: any): number {
    const processor = this.determineProcessor(analysis);
    if (processor.type === 'local') return 0;

    const tokenCosts = {
      'gpt-4-turbo-preview': 0.00001,
      'gpt-4': 0.00003,
      'gpt-3.5-turbo': 0.000001
    };

    return analysis.tokenCount * tokenCosts[processor.model as keyof typeof tokenCosts];
  }
}

export const JohnnyGoGetter: NexusAgent = {
  id: 'johnny-go-getter',
  name: 'Johnny Go Getter',
  type: 'coordinator',
  status: 'active',
  clearance: 8,
  specialization: [
    'task-management',
    'system-access',
    'security-enforcement',
    'resource-optimization',
    'api-coordination'
  ],
  personality: new JohnnyGoGetterAgent().personality
};