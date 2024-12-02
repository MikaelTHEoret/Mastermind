import { OpenAIProvider } from './providers/openai';
import { AnthropicProvider } from './providers/anthropic';
import type { AIConfig, AIProvider } from './types';

export function createAIProvider(config: AIConfig) {
  switch (config.provider) {
    case 'openai':
      return new OpenAIProvider(config);
    case 'anthropic':
      return new AnthropicProvider(config);
    default:
      throw new Error(`Unsupported AI provider: ${config.provider}`);
  }
}