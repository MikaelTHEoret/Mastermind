import { app, dialog } from 'electron';
import fs from 'fs/promises';
import path from 'path';
import chokidar from 'chokidar';

export class FileSystemManager {
  private watcher: any;
  private projectRoot: string;

  constructor() {
    this.projectRoot = process.cwd();
    this.initializeWatcher();
  }

  private initializeWatcher() {
    this.watcher = chokidar.watch(this.projectRoot, {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      persistent: true
    });

    this.watcher
      .on('change', path => console.log(`File ${path} has been changed`))
      .on('unlink', path => console.log(`File ${path} has been removed`));
  }

  async requestPermissions(): Promise<boolean> {
    try {
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        defaultPath: this.projectRoot,
        message: 'Select project directory to grant file system permissions'
      });

      if (!result.canceled) {
        this.projectRoot = result.filePaths[0];
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      return false;
    }
  }

  async readFile(filePath: string): Promise<string> {
    const fullPath = path.join(this.projectRoot, filePath);
    return fs.readFile(fullPath, 'utf-8');
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, filePath);
    await fs.writeFile(fullPath, content, 'utf-8');
  }

  async listFiles(dirPath: string): Promise<string[]> {
    const fullPath = path.join(this.projectRoot, dirPath);
    return fs.readdir(fullPath);
  }

  async createDirectory(dirPath: string): Promise<void> {
    const fullPath = path.join(this.projectRoot, dirPath);
    await fs.mkdir(fullPath, { recursive: true });
  }
}