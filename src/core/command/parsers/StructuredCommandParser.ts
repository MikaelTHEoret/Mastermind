import { CommandParser } from './CommandParser';
import { ParsedCommand, CommandContext } from '../types/CommandTypes';

export class StructuredCommandParser extends CommandParser {
  parse(input: string, context: CommandContext): ParsedCommand {
    try {
      // Try parsing as JSON first
      const structured = JSON.parse(input);
      return {
        action: structured.action,
        target: structured.target,
        parameters: structured.parameters || {},
        context
      };
    } catch {
      // If not JSON, try parsing command-line style format
      return this.parseCommandLine(input, context);
    }
  }

  private parseCommandLine(input: string, context: CommandContext): ParsedCommand {
    const parts = input.match(/[^\s"']+|"([^"]*)"|'([^']*)'/g) || [];
    const cleanParts = parts.map(part => part.replace(/^["']|["']$/g, ''));

    if (cleanParts.length < 2) {
      throw new Error('Invalid command format');
    }

    const [action, target, ...rest] = cleanParts;
    const parameters = this.parseParameters(rest);

    return {
      action,
      target,
      parameters,
      context
    };
  }

  private parseParameters(args: string[]): Record<string, unknown> {
    const parameters: Record<string, unknown> = {};
    let currentKey: string | null = null;

    for (const arg of args) {
      if (arg.startsWith('--')) {
        currentKey = arg.slice(2);
        parameters[currentKey] = true;
      } else if (currentKey) {
        parameters[currentKey] = this.parseValue(arg);
        currentKey = null;
      }
    }

    return parameters;
  }

  private parseValue(value: string): unknown {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    if (value.toLowerCase() === 'null') return null;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }
}