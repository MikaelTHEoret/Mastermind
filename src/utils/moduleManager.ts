import { ModuleConfig } from '../types';
import fs from 'fs/promises';
import path from 'path';

export class ModuleManager {
  private modulesDir: string;

  constructor() {
    this.modulesDir = path.join(process.cwd(), 'src/modules');
  }

  async createModule(config: ModuleConfig): Promise<void> {
    const filePath = path.join(this.modulesDir, config.fileName);
    
    try {
      await fs.writeFile(filePath, config.code, 'utf-8');
      console.log(`Module created successfully: ${config.fileName}`);
    } catch (error) {
      console.error('Error creating module:', error);
      throw new Error(`Failed to create module: ${error.message}`);
    }
  }

  async listModules(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.modulesDir);
      return files.filter(file => file.endsWith('.tsx') || file.endsWith('.ts'));
    } catch (error) {
      console.error('Error listing modules:', error);
      return [];
    }
  }
}