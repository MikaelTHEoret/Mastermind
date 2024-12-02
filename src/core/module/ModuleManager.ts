import { FileSystemManager } from '../../utils/fileSystem';
import { ModuleAnalyzer } from './ModuleAnalyzer';
import { LLMManager } from '../LLMManager';
import { EventEmitter } from 'events';
import path from 'path';

export class ModuleManager extends EventEmitter {
  private fs: FileSystemManager;
  private analyzer: ModuleAnalyzer;
  private llm: LLMManager;
  private modules: Map<string, any> = new Map();

  constructor(llm: LLMManager) {
    super();
    this.fs = new FileSystemManager();
    this.llm = llm;
    this.analyzer = new ModuleAnalyzer(llm);
  }

  async createModule(description: string): Promise<string> {
    try {
      // Generate module code using LLM
      const moduleCode = await this.llm.processCommand(`
        Create a TypeScript module based on this description:
        ${description}
        
        Return the complete module code following best practices.
      `);

      // Generate a suitable filename
      const filename = await this.generateFilename(description);
      const filePath = path.join(process.cwd(), 'src/modules', filename);

      // Analyze generated code
      const analysis = await this.analyzer.analyzeFile(filePath);
      
      if (!analysis.security.safe) {
        throw new Error('Generated module failed security checks');
      }

      // Write module file
      await this.fs.writeFile(filePath, moduleCode);

      // Register module
      await this.analyzer.processModule(filePath, analysis);

      this.emit('moduleCreated', {
        name: filename,
        description,
        analysis
      });

      return filename;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  async loadModule(name: string): Promise<any> {
    if (this.modules.has(name)) {
      return this.modules.get(name);
    }

    const filePath = path.join(process.cwd(), 'src/modules', name);
    
    try {
      const module = await import(filePath);
      this.modules.set(name, module);
      return module;
    } catch (error) {
      this.emit('error', error);
      throw error;
    }
  }

  private async generateFilename(description: string): Promise<string> {
    const response = await this.llm.processCommand(`
      Generate a suitable filename for a module described as:
      ${description}
      
      Return only the filename with .ts extension.
    `);

    return response.trim();
  }
}