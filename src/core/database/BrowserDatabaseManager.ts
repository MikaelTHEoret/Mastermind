import { openDB, IDBPDatabase } from 'idb';
import type { LogEntry } from '../../types/database';

export class BrowserDatabaseManager {
  private db: IDBPDatabase | null = null;

  async initialize(): Promise<void> {
    this.db = await openDB('mastermind', 1, {
      upgrade(db) {
        // Create stores
        if (!db.objectStoreNames.contains('interactions')) {
          db.createObjectStore('interactions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('modules')) {
          db.createObjectStore('modules', { keyPath: 'name' });
        }
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences', { keyPath: 'key' });
        }
      },
    });
  }

  async logInteraction(entry: LogEntry): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    await this.db.add('interactions', {
      ...entry,
      timestamp: new Date()
    });
  }

  async getInteractions(): Promise<LogEntry[]> {
    if (!this.db) throw new Error('Database not initialized');
    return this.db.getAll('interactions');
  }

  async storeModule(name: string, content: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('modules', { name, content });
  }

  async getModule(name: string): Promise<string | undefined> {
    if (!this.db) throw new Error('Database not initialized');
    const module = await this.db.get('modules', name);
    return module?.content;
  }

  async listModules(): Promise<string[]> {
    if (!this.db) throw new Error('Database not initialized');
    const modules = await this.db.getAllKeys('modules');
    return modules as string[];
  }

  async setPreference(key: string, value: any): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    await this.db.put('preferences', { key, value });
  }

  async getPreference(key: string): Promise<any> {
    if (!this.db) throw new Error('Database not initialized');
    const pref = await this.db.get('preferences', key);
    return pref?.value;
  }
}