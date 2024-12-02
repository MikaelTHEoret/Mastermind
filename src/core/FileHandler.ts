import AdmZip from 'adm-zip';
import { FileSystemManager } from '../utils/fileSystem';
import { SecurityScanner } from './security/SecurityScanner';
import { ModuleAnalyzer } from './module/ModuleAnalyzer';
import path from 'path';

export class FileHandler {
  private fs: FileSystemManager;
  private security: SecurityScanner;
  private analyzer: ModuleAnalyzer;

  constructor() {
    this.fs = new FileSystemManager();
    this.security = new SecurityScanner();
    this.analyzer = new ModuleAnalyzer();
  }

  async processFile(filePath: string): Promise<void> {
    const ext = path.extname(filePath).toLowerCase();
    
    switch (ext) {
      case '.zip':
        await this.handleZipFile(filePath);
        break;
      case '.js':
      case '.ts':
      case '.jsx':
      case '.tsx':
        await this.handleCodeFile(filePath);
        break;
      default:
        await this.handleGenericFile(filePath);
    }
  }

  private async handleZipFile(filePath: string): Promise<void> {
    const zip = new AdmZip(filePath);
    const extractPath = await this.fs.createTempDirectory();
    
    zip.extractAllTo(extractPath, true);
    
    // Scan extracted files
    await this.security.scanDirectory(extractPath);
    
    // Process each file
    const entries = zip.getEntries();
    for (const entry of entries) {
      if (!entry.isDirectory) {
        await this.processFile(path.join(extractPath, entry.entryName));
      }
    }
  }

  private async handleCodeFile(filePath: string): Promise<void> {
    // Security scan
    const isSafe = await this.security.scanFile(filePath);
    if (!isSafe) {
      throw new Error(`Security scan failed for ${filePath}`);
    }

    // Analyze code
    const analysis = await this.analyzer.analyzeFile(filePath);
    
    // Process as module if applicable
    if (analysis.isModule) {
      await this.analyzer.processModule(filePath, analysis);
    }
  }

  private async handleGenericFile(filePath: string): Promise<void> {
    const isSafe = await this.security.scanFile(filePath);
    if (!isSafe) {
      throw new Error(`Security scan failed for ${filePath}`);
    }
    
    // Store file metadata
    await this.fs.storeFileMetadata(filePath);
  }
}