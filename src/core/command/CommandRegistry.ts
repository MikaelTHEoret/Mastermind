import { CommandExecutor, ParsedCommand } from './types/CommandTypes';

export class CommandRegistry {
  private executors: Map<string, CommandExecutor> = new Map();

  register(name: string, executor: CommandExecutor): void {
    this.executors.set(name, executor);
  }

  unregister(name: string): void {
    this.executors.delete(name);
  }

  getExecutor(command: ParsedCommand): CommandExecutor | undefined {
    for (const executor of this.executors.values()) {
      if (executor.canHandle(command)) {
        return executor;
      }
    }
    return undefined;
  }

  listExecutors(): string[] {
    return Array.from(this.executors.keys());
  }
}