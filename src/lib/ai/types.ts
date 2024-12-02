export type AIProvider = 'openai' | 'anthropic';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface FilePermissions {
  read: boolean;
  write: boolean;
  allowedPaths: string[];
  blockedPaths: string[];
}

export interface AppConfig {
  ai: AIConfig;
  fileSystem: FilePermissions;
}