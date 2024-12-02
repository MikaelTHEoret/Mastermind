import { FileSystemManager } from '../../utils/fileSystem';
import { SecurityScanner } from '../security/SecurityScanner';
import { LLMManager } from '../LLMManager';
import path from 'path';

interface ModuleAnalysis {
  isModule: boolean;
  dependencies: string[];
  exports: string[];
  security: {
    safe: boolean;
    issues: string[];
  };
}

export class ModuleAnalyzer {
  private fs: FileSystemManager;
  private security: SecurityScanner;
  private llm: LLMManager;

  constructor(llm: LLMManager) {
    this.fs = new FileSystemManager();
    this.security = new SecurityScanner();
    this.llm = llm;
  }

  async analyzeFile(filePath: string): Promise<ModuleAnalysis> {
    const content = await this.fs.readFile(filePath);
    const ext = path.extname(filePath);

    // Basic security scan
    const securityResult = await this.security.scanFile(filePath);

    // Use LLM for advanced analysis
    const analysis = await this.llm.processCommand(`
      Analyze this code and return a JSON object with:
      - Whether it's a valid module
      - List of dependencies
      - List of exports
      - Any potential security concerns
      
      Code:
      ${content}
    `);

    const result = JSON.parse(analysis);

    return {
      isModule: result.isModule,
      dependencies: result.dependencies,
      exports: result.exports,
      security: {
        safe: securityResult,
        issues: result.securityConcerns || []
      }
    };
  }

  async processModule(filePath: string, analysis: ModuleAnalysis): Promise<void> {
    if (!analysis.security.safe) {
      throw new Error(`Module ${filePath} failed security checks`);
    }

    // Create module directory if needed
    const moduleDir = path.join(process.cwd(), 'src/modules');
    await this.fs.createDirectory(moduleDir);

    // Copy and rename module
    const moduleName = path.basename(filePath);
    const targetPath = path.join(moduleDir, moduleName);
    
    await this.fs.writeFile(targetPath, await this.fs.readFile(filePath));

    // Register module
    await this.registerModule(moduleName, analysis);
  }

  private async registerModule(name: string, analysis: ModuleAnalysis): Promise<void> {
    const registryPath = path.join(process.cwd(), 'src/modules/registry.json');
    let registry = {};

    try {
      const content = await this.fs.readFile(registryPath);
      registry = JSON.parse(content);
    } catch (error) {
      // Registry doesn't exist yet
    }

    registry[name] = {
      ...analysis,
      registeredAt: new Date().toISOString()
    };

    await this.fs.writeFile(registryPath, JSON.stringify(registry, null, 2));
  }
}