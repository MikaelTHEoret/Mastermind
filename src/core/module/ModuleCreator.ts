import { LLMManager } from '../LLMManager';
import { SecurityScanner } from '../security/SecurityScanner';
import { FileSystemManager } from '../../utils/fileSystem';
import { ModuleConfig } from '../../types';

export class ModuleCreator {
  private llm: LLMManager;
  private security: SecurityScanner;
  private fs: FileSystemManager;

  constructor(llm: LLMManager) {
    this.llm = llm;
    this.security = new SecurityScanner();
    this.fs = new FileSystemManager();
  }

  async createModule(description: string): Promise<ModuleConfig> {
    try {
      // Generate module code using LLM
      const moduleConfig = await this.llm.processCommand(`
        Create a TypeScript React module based on this description:
        ${description}
        
        Return a JSON object with:
        {
          "fileName": "appropriate-name.tsx",
          "code": "complete module code",
          "description": "brief description"
        }
      `);

      const config = JSON.parse(moduleConfig);

      // Validate generated code
      const isSafe = await this.security.validateCode(config.code);
      if (!isSafe) {
        throw new Error('Generated code failed security validation');
      }

      // Write module file
      const filePath = `src/modules/${config.fileName}`;
      await this.fs.writeFile(filePath, config.code);

      return config;
    } catch (error) {
      console.error('Module creation failed:', error);
      throw error;
    }
  }
}