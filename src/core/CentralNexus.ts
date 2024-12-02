import { create } from 'zustand';
import { LLMManager } from './LLMManager';
import { DatabaseManager } from './database/DatabaseManager';
import { FileHandler } from './FileHandler';
import { SecurityScanner } from './security/SecurityScanner';
import { ResourceMonitor } from './ResourceMonitor';
import { VersionControl } from './VersionControl';
import { EventCoordinator } from './EventCoordinator';
import { CommandProcessor } from '../types';

export class CentralNexus implements CommandProcessor {
  private llm: LLMManager;
  private db: DatabaseManager;
  private fileHandler: FileHandler;
  private security: SecurityScanner;
  private monitor: ResourceMonitor;
  private versionControl: VersionControl;
  private eventCoordinator: EventCoordinator;

  constructor() {
    this.db = new DatabaseManager();
    this.llm = new LLMManager(this.db);
    this.fileHandler = new FileHandler();
    this.security = new SecurityScanner();
    this.monitor = new ResourceMonitor();
    this.versionControl = new VersionControl();
    this.eventCoordinator = new EventCoordinator();

    this.initialize();
  }

  private async initialize() {
    await this.monitor.startMonitoring();
    this.monitor.on('metrics', (metrics) => {
      console.log('System metrics:', metrics);
    });
  }

  async processCommand(command: string): Promise<string> {
    try {
      // Log the command
      await this.db.logInteraction({
        type: 'command',
        content: command,
        timestamp: new Date(),
        success: true,
        response: '',
      });

      // Process with LLM
      const response = await this.llm.processCommand(command);

      // Update interaction log with response
      await this.db.logInteraction({
        type: 'response',
        content: response,
        timestamp: new Date(),
        success: true,
        response: response,
      });

      return response;
    } catch (error) {
      console.error('Error processing command:', error);
      return `Error: ${error.message}`;
    }
  }

  async createSnapshot(description: string): Promise<string> {
    return this.versionControl.createSnapshot(description);
  }

  async rollback(versionId: string): Promise<void> {
    return this.versionControl.rollback(versionId);
  }

  async processFile(filePath: string): Promise<void> {
    return this.fileHandler.processFile(filePath);
  }

  getSystemMetrics() {
    return this.monitor.getMetrics();
  }
}

interface NexusState {
  nexus: CentralNexus;
  messages: any[];
  addMessage: (message: any) => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  nexus: new CentralNexus(),
  messages: [],
  addMessage: (message) => 
    set((state) => ({ 
      messages: [...state.messages, message] 
    })),
}));