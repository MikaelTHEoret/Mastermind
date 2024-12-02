import { CommandExecutor, ParsedCommand } from '../types/CommandTypes';

export abstract class BaseCommandExecutor implements CommandExecutor {
  protected abstract readonly targetType: string;

  canHandle(command: ParsedCommand): boolean {
    return command.target === this.targetType;
  }

  abstract execute(command: ParsedCommand): Promise<string>;

  protected validateParameters(command: ParsedCommand, required: string[]): void {
    for (const param of required) {
      if (!(param in command.parameters)) {
        throw new Error(`Missing required parameter: ${param}`);
      }
    }
  }

  protected getParameter<T>(command: ParsedCommand, name: string, defaultValue?: T): T {
    return (command.parameters[name] as T) ?? defaultValue;
  }
}