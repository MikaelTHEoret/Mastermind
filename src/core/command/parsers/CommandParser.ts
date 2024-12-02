import { ParsedCommand, CommandContext } from '../types/CommandTypes';

export class CommandParser {
  private static readonly ACTION_PATTERNS = [
    /^(create|add|new)\s+(\w+)(?:\s+(.+))?$/i,
    /^(update|modify|change)\s+(\w+)(?:\s+(.+))?$/i,
    /^(delete|remove)\s+(\w+)(?:\s+(.+))?$/i,
    /^(show|display|list)\s+(\w+)(?:\s+(.+))?$/i,
  ];

  parse(input: string, context: CommandContext): ParsedCommand {
    for (const pattern of CommandParser.ACTION_PATTERNS) {
      const match = input.match(pattern);
      if (match) {
        const [, action, target, params = ''] = match;
        return {
          action: action.toLowerCase(),
          target,
          parameters: this.parseParameters(params),
          context
        };
      }
    }

    return {
      action: 'unknown',
      parameters: {},
      context
    };
  }

  private parseParameters(paramString: string): Record<string, unknown> {
    if (!paramString.trim()) {
      return {};
    }

    try {
      // Try parsing as JSON first
      return JSON.parse(paramString);
    } catch {
      // Fall back to key=value parsing
      return paramString.split(/\s+/)
        .reduce((params, pair) => {
          const [key, value] = pair.split('=');
          if (key && value) {
            params[key] = this.parseValue(value);
          }
          return params;
        }, {} as Record<string, unknown>);
    }
  }

  private parseValue(value: string): unknown {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
    if (value.toLowerCase() === 'null') return null;
    if (!isNaN(Number(value))) return Number(value);
    return value;
  }
}