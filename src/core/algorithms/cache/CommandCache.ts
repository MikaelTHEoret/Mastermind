interface CacheEntry {
  result: string;
  timestamp: number;
}

export class CommandCache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly ttl: number;

  constructor(ttlMinutes: number = 5) {
    this.ttl = ttlMinutes * 60 * 1000;
  }

  get(command: string): string | null {
    const entry = this.cache.get(command);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(command);
      return null;
    }

    return entry.result;
  }

  set(command: string, result: string): void {
    this.cache.set(command, {
      result,
      timestamp: Date.now()
    });
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}