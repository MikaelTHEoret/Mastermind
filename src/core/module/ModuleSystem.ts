import { EventEmitter } from 'events';
import { FileSystemManager } from '../../utils/fileSystem';
import { SecurityScanner } from '../security/SecurityScanner';
import { ModuleAnalyzer } from './ModuleAnalyzer';
import { ModuleManager } from './ModuleManager';
import { LLMManager } from '../LLMManager';
import { DatabaseManager } from '../database/DatabaseManager';

export class ModuleSystem extends EventEmitter {
  private fileSystem: FileSystemManager;
  private security: SecurityScanner;
  private analyzer: ModuleAnalyzer;
  private manager: ModuleManager;
  private llm: LLMManager;
  private db: DatabaseManager;

  constructor(llm: LLMManager, db: DatabaseManager) {
    super();
    this.fileSystem = new FileSystemManager();
    this.security = new SecurityScanner();
    this.llm = llm;
    this.db = db;
    this.analyzer = new ModuleAnalyzer(this.llm);
    this.manager = new ModuleManager(this.llm);

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.manager.on('moduleCreated', async (data) => {
      await this.db.logInteraction({
        type: 'module_creation',
        content: data.description,
        response: `Module ${data.name} created successfully`,
        success: true,
        timestamp: new Date(),
        context: data.analysis
      });
      
      this.emit('moduleCreated', data);
    });

    this.manager.on('error', (error) => {
      this.emit('error', error);
    });
  }

  async createModule(description: string): Promise<string> {
    try {
      return await this.manager.createModule(description);
    } catch (error) {
      await this.db.logInteraction({
        type: 'module_creation',
        content: description,
        response: error.message,
        success: false,
        timestamp: new Date()
      });
      throw error;
    }
  }

  async processCommand(command: string): Promise<string> {
    if (command.toLowerCase().includes('create module')) {
      const description = command.replace(/create module/i, '').trim();
      const moduleName = await this.createModule(description);
      return `Module ${moduleName} created successfully`;
    }

    // Other module-related commands can be handled here
    return this.llm.processCommand(command);
  }

  async importModule(path: string): Promise<void> {
    const analysis = await this.analyzer.analyzeFile(path);
    
    if (!analysis.security.safe) {
      throw new Error(`Module at ${path} failed security checks`);
    }

    await this.analyzer.processModule(path, analysis);
  }

  async listModules(): Promise<string[]> {
    return this.manager.listModules();
  }

  async getModuleContent(name: string): Promise<string> {
    return this.fileSystem.readFile(`src/modules/${name}`);
  }

  async updateModuleContent(name: string, content: string): Promise<void> {
    const analysis = await this.analyzer.analyzeContent(content);
    
    if (!analysis.security.safe) {
      throw new Error('Updated content failed security checks');
    }

    await this.fileSystem.writeFile(`src/modules/${name}`, content);
  }
}