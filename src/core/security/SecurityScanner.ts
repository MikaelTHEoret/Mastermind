import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export class SecurityScanner {
  private readonly BLOCKLIST = [
    'eval(',
    'Function(',
    'setTimeout(',
    'setInterval(',
    'process.env',
    'require(',
    'import(',
  ];

  async scanFile(filePath: string): Promise<boolean> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      
      // Check for malicious patterns
      if (this.containsBlockedPatterns(content)) {
        return false;
      }
      
      // Verify file integrity
      const hash = await this.calculateFileHash(filePath);
      
      // TODO: Compare hash against known good hashes
      
      return true;
    } catch (error) {
      console.error('Security scan failed:', error);
      return false;
    }
  }

  async scanDirectory(dirPath: string): Promise<boolean> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        
        if (entry.isDirectory()) {
          const isDirectorySafe = await this.scanDirectory(fullPath);
          if (!isDirectorySafe) return false;
        } else {
          const isFileSafe = await this.scanFile(fullPath);
          if (!isFileSafe) return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Directory scan failed:', error);
      return false;
    }
  }

  private containsBlockedPatterns(content: string): boolean {
    return this.BLOCKLIST.some(pattern => content.includes(pattern));
  }

  private async calculateFileHash(filePath: string): Promise<string> {
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}