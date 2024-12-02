import { FileSystemManager } from '../../utils/fileSystem';
import { SecurityScanner } from '../security/SecurityScanner';
import { ModuleAnalyzer } from './ModuleAnalyzer';
import { ModuleTransformer } from './ModuleTransformer';
import { ModuleRegistry } from './ModuleRegistry';
import { LLMManager } from '../LLMManager';
import { DatabaseManager } from '../database/DatabaseManager';
import { EventEmitter } from 'events';
import path from 'path';
import AdmZip from 'adm-zip';

export class ModuleIntegrator extends EventEmitter {
  private fs: FileSystemManager;
  private security: SecurityScanner;
  private analyzer: ModuleAnalyzer;
  private transformer: ModuleTransformer;
  private registry: ModuleRegistry;
  private llm: LLMManager;
  private db: DatabaseManager;

  constructor(llm: LLMManager, db: DatabaseManager) {
    super();
    this.fs = new FileSystemManager();
    this.security = new SecurityScanner();
    this.analyzer = new ModuleAnalyzer(llm);
    this.transformer = new ModuleTransformer(llm);
    this.registry = new ModuleRegistry(db);
    this.llm = llm;
    this.db = db;
  }

  async integrateModule(input: string | Buffer, options: {
    type?: 'file' | 'directory' | 'zip' | 'url';
    name?: string;
  } = {}): Promise<string> {
    try {
      // Create temporary workspace
      const workspacePath = await this.fs.createTempDirectory();
      
      // Process input based on type
      const sourcePath = await this.processInput(input, workspacePath, options);
      
      // Analyze module
      const analysis = await this.analyzer.analyzeFile(sourcePath);
      
      if (!analysis.security.safe) {
        throw new Error(`Module failed security checks: ${analysis.security.issues.join(', ')}`);
      }

      // Transform module to be compatible with Mastermind
      const transformedCode = await this.transformer.transform(sourcePath, analysis);
      
      // Generate module name if not provided
      const moduleName = options.name || await this.generateModuleName(analysis);
      
      // Write transformed module
      const targetPath = path.join(process.cwd(), 'src/modules', moduleName);
      await this.fs.writeFile(targetPath, transformedCode);

      // Register module
      await this.registry.registerModule({
        name: moduleName,
        description: analysis.description,
        version: '1.0.0',
        dependencies: analysis.dependencies,
        exports: analysis.exports,
        created: new Date(),
        lastModified: new Date()
      });

      // Log successful integration
      await this.db.logInteraction({
        type: 'module_integration',
        content: moduleName,
        response: 'Module integrated successfully',
        success: true,
        timestamp: new Date(),
        context: analysis
      });

      this.emit('moduleIntegrated', {
        name: moduleName,
        analysis
      });

      return moduleName;
    } catch (error) {
      await this.db.logInteraction({
        type: 'module_integration',
        content: String(input),
        response: error.message,
        success: false,
        timestamp: new Date()
      });
      
      throw error;
    }
  }

  private async processInput(
    input: string | Buffer,
    workspacePath: string,
    options: { type?: string } = {}
  ): Promise<string> {
    if (options.type === 'zip') {
      const zip = new AdmZip(input as Buffer);
      zip.extractAllTo(workspacePath, true);
      return workspacePath;
    }

    if (options.type === 'url') {
      const response = await fetch(input as string);
      const content = await response.text();
      const filePath = path.join(workspacePath, 'module.ts');
      await this.fs.writeFile(filePath, content);
      return filePath;
    }

    if (Buffer.isBuffer(input)) {
      const filePath = path.join(workspacePath, 'module.ts');
      await this.fs.writeFile(filePath, input);
      return filePath;
    }

    return input as string;
  }

  private async generateModuleName(analysis: any): Promise<string> {
    const baseName = analysis.name || 'module';
    const timestamp = Date.now();
    return `${baseName}-${timestamp}.ts`;
  }
}