import { CommandParser } from './CommandParser';
import { ParsedCommand, CommandContext } from '../types/CommandTypes';

export class NaturalLanguageParser extends CommandParser {
  private static readonly INTENT_PATTERNS = {
    create: /^(create|make|add|new)\s+/i,
    read: /^(show|display|list|get)\s+/i,
    update: /^(update|modify|change|edit)\s+/i,
    delete: /^(delete|remove|destroy)\s+/i
  };

  parse(input: string, context: CommandContext): ParsedCommand {
    // First try to identify the intent
    for (const [intent, pattern] of Object.entries(NaturalLanguageParser.INTENT_PATTERNS)) {
      if (pattern.test(input)) {
        return this.parseWithIntent(intent, input.replace(pattern, ''), context);
      }
    }

    // If no clear intent is found, treat as a query
    return {
      action: 'query',
      parameters: { text: input },
      context
    };
  }

  private parseWithIntent(intent: string, remaining: string, context: CommandContext): ParsedCommand {
    const parts = remaining.trim().split(/\s+/);
    const target = parts[0];
    const parameters = this.extractParameters(parts.slice(1).join(' '));

    return {
      action: intent,
      target,
      parameters,
      context
    };
  }

  private extractParameters(text: string): Record<string, unknown> {
    const params: Record<string, unknown> = {};
    
    // Try to extract key-value pairs
    const keyValuePattern = /(\w+)=(?:"([^"]*)"|(\S+))/g;
    let match;
    
    while ((match = keyValuePattern.exec(text)) !== null) {
      const [, key, quotedValue, value] = match;
      params[key] = quotedValue || value;
    }

    // If no key-value pairs found, use remaining text as description
    if (Object.keys(params).length === 0 && text.trim()) {
      params.description = text.trim();
    }

    return params;
  }
}