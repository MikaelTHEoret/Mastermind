import { CommandPattern, PatternHandler } from './CommandPattern';

export function createDefaultPatterns(handler: PatternHandler): CommandPattern[] {
  return [
    {
      pattern: /^(show|display|list)\s+(\w+)$/i,
      handler: async (matches) => ({
        result: await handler.handleDisplayCommand(matches[2]),
        confidence: 0.9,
        needsLLM: false
      }),
      priority: 1
    },
    {
      pattern: /^(create|add|new)\s+(\w+)\s+(.+)$/i,
      handler: async (matches) => ({
        result: await handler.handleCreateCommand(matches[2], matches[3]),
        confidence: 0.9,
        needsLLM: false
      }),
      priority: 2
    },
    {
      pattern: /^(update|modify|change)\s+(\w+)\s+(.+)$/i,
      handler: async (matches) => ({
        result: await handler.handleUpdateCommand(matches[2], matches[3]),
        confidence: 0.9,
        needsLLM: false
      }),
      priority: 2
    },
    {
      pattern: /^(delete|remove)\s+(\w+)\s+(.+)$/i,
      handler: async (matches) => ({
        result: await handler.handleDeleteCommand(matches[2], matches[3]),
        confidence: 0.9,
        needsLLM: false
      }),
      priority: 3
    }
  ];
}