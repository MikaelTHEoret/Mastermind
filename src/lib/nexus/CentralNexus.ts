import type { NexusCore, NexusAgent, ResourceMetrics, APIMetrics } from './types';
import { JohnnyGoGetter } from './JohnnyGoGetter';
import { SirExecutor } from './SirExecutor';
import { useLogStore } from '../../stores/logStore';
import { useConfigStore } from '../../stores/configStore';
import { storageManager } from '../storage/db';

class CentralNexusSystem {
  private core: NexusCore;
  private agents: Map<string, NexusAgent>;
  private logger = useLogStore.getState();
  private config = useConfigStore.getState().config;
  private initialized: boolean = false;
  private initializationAttempts: number = 0;
  private readonly MAX_INIT_ATTEMPTS = 3;

  constructor() {
    this.core = {
      id: 'central-nexus-001',
      name: 'Central Nexus',
      status: 'standby',
      capabilities: new Set([
        'task-coordination',
        'resource-management',
        'agent-supervision',
        'security-enforcement',
        'data-flux-processing',
        'module-integration',
        'context-awareness'
      ]),
      connectedAgents: new Set(),
      securityLevel: 10,
      resourceUsage: this.initializeResourceMetrics(),
      apiUsage: this.initializeAPIMetrics()
    };

    this.agents = new Map();
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      this.logger.addLog({
        source: 'CentralNexus',
        type: 'info',
        message: 'System already initialized.'
      });
      return;
    }

    if (this.initializationAttempts >= this.MAX_INIT_ATTEMPTS) {
      throw new Error('Maximum initialization attempts exceeded');
    }

    this.initializationAttempts++;

    try {
      this.logger.addLog({
        source: 'CentralNexus',
        type: 'info',
        message: `Starting system initialization (Attempt ${this.initializationAttempts}/${this.MAX_INIT_ATTEMPTS})`
      });

      // Initialize Storage System
      try {
        await storageManager.initialize();
        this.logger.addLog({
          source: 'CentralNexus',
          type: 'info',
          message: 'Storage system initialized successfully'
        });
      } catch (error) {
        throw new Error(`Storage initialization failed: ${error.message}`);
      }

      // Register Core Agents
      try {
        await this.registerCoreAgents();
        this.logger.addLog({
          source: 'CentralNexus',
          type: 'info',
          message: 'Core agents registered successfully'
        });
      } catch (error) {
        throw new Error(`Agent registration failed: ${error.message}`);
      }

      this.core.status = 'active';
      this.initialized = true;
      this.initializationAttempts = 0;

      this.logger.addLog({
        source: 'CentralNexus',
        type: 'info',
        message: 'Central Nexus initialized successfully'
      });
    } catch (error) {
      this.core.status = 'error';
      this.logger.addLog({
        source: 'CentralNexus',
        type: 'error',
        message: `Initialization failed: ${error.message}`
      });

      if (this.initializationAttempts < this.MAX_INIT_ATTEMPTS) {
        this.logger.addLog({
          source: 'CentralNexus',
          type: 'info',
          message: `Retrying initialization in 5 seconds...`
        });
        await new Promise(resolve => setTimeout(resolve, 5000));
        return this.initialize();
      }

      throw error;
    }
  }

  private async registerCoreAgents(): Promise<void> {
    // Register Johnny Go Getter
    try {
      this.registerAgent(JohnnyGoGetter);
      this.logger.addLog({
        source: 'CentralNexus',
        type: 'info',
        message: 'Johnny Go Getter registered successfully'
      });
    } catch (error) {
      throw new Error(`Failed to register Johnny Go Getter: ${error.message}`);
    }

    // Register Sir Executor
    try {
      this.registerAgent(SirExecutor);
      this.logger.addLog({
        source: 'CentralNexus',
        type: 'info',
        message: 'Sir Executor registered successfully'
      });
    } catch (error) {
      throw new Error(`Failed to register Sir Executor: ${error.message}`);
    }
  }

  private registerAgent(agent: NexusAgent): void {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with ID ${agent.id} is already registered`);
    }

    this.agents.set(agent.id, agent);
    this.core.connectedAgents.add(agent.id);
  }

  private initializeResourceMetrics(): ResourceMetrics {
    return {
      cpu: 0,
      memory: 0,
      storage: 0,
      network: 0
    };
  }

  private initializeAPIMetrics(): APIMetrics {
    return {
      totalCalls: 0,
      totalTokens: 0,
      costToDate: 0,
      lastCall: new Date().toISOString(),
      quotaRemaining: 1000000
    };
  }

  public getState(): NexusCore {
    return this.core;
  }

  public getAgent(id: string): NexusAgent | undefined {
    return this.agents.get(id);
  }

  public getAgents(): Map<string, NexusAgent> {
    return this.agents;
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public async processCommand(command: string): Promise<string> {
    try {
      // Process command through appropriate agent or directly
      const response = await this.executeCommand(command);
      return response;
    } catch (error) {
      return `Error processing command: ${error.message}`;
    }
  }

  private async executeCommand(command: string): Promise<string> {
    // Basic command processing implementation
    return `Processed command: ${command}`;
  }
}

export const centralNexus = new CentralNexusSystem();