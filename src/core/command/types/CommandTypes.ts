export interface CommandContext {
  userId?: string;
  timestamp: Date;
  source: 'terminal' | 'voice' | 'api';
  metadata?: Record<string, unknown>;
}

export interface CommandOptions {
  priority?: number;
  timeout?: number;
  retries?: number;
}

export interface ParsedCommand {
  action: string;
  target?: string;
  parameters: Record<string, unknown>;
  context: CommandContext;
}

export interface CommandExecutor {
  execute(command: ParsedCommand): Promise<string>;
  canHandle(command: ParsedCommand): boolean;
}