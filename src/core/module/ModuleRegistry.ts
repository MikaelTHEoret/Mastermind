import { EventEmitter } from 'events';
import { DatabaseManager } from '../database/DatabaseManager';

interface ModuleInfo {
  name: string;
  description: string;
  version: string;
  dependencies: string[];
  exports: string[];
  created: Date;
  lastModified: Date;
}

export class ModuleRegistry extends EventEmitter {
  private modules: Map<string, ModuleInfo> = new Map();
  private db: DatabaseManager;

  constructor(db: DatabaseManager) {
    super();
    this.db = db;
  }

  async registerModule(info: ModuleInfo): Promise<void> {
    this.modules.set(info.name, info);
    
    await this.db.logInteraction({
      type: 'module_registration',
      content: info.name,
      response: 'Module registered successfully',
      success: true,
      timestamp: new Date(),
      context: info
    });

    this.emit('moduleRegistered', info);
  }

  async unregisterModule(name: string): Promise<void> {
    this.modules.delete(name);
    
    await this.db.logInteraction({
      type: 'module_unregistration',
      content: name,
      response: 'Module unregistered successfully',
      success: true,
      timestamp: new Date()
    });

    this.emit('moduleUnregistered', name);
  }

  getModuleInfo(name: string): ModuleInfo | undefined {
    return this.modules.get(name);
  }

  listModules(): ModuleInfo[] {
    return Array.from(this.modules.values());
  }

  async updateModuleInfo(name: string, updates: Partial<ModuleInfo>): Promise<void> {
    const current = this.modules.get(name);
    if (!current) {
      throw new Error(`Module ${name} not found`);
    }

    const updated = {
      ...current,
      ...updates,
      lastModified: new Date()
    };

    this.modules.set(name, updated);
    
    await this.db.logInteraction({
      type: 'module_update',
      content: name,
      response: 'Module info updated successfully',
      success: true,
      timestamp: new Date(),
      context: updated
    });

    this.emit('moduleUpdated', updated);
  }
}