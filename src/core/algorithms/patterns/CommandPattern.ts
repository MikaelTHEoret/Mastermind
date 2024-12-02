import { CommandResult } from '../../../types';

export interface CommandPattern {
  pattern: RegExp;
  handler: (matches: RegExpMatchArray) => Promise<CommandResult>;
  priority: number;
}

export interface PatternHandler {
  handleDisplayCommand: (target: string) => Promise<string>;
  handleCreateCommand: (type: string, params: string) => Promise<string>;
  handleUpdateCommand: (type: string, params: string) => Promise<string>;
  handleDeleteCommand: (type: string, target: string) => Promise<string>;
}