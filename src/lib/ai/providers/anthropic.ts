import type { AIConfig } from '../types';

interface AnthropicMessage {
  role: string;
  content: string;
}

export class AnthropicProvider {
  private config: AIConfig;
  private requestHistory: Array<{ prompt: string; timestamp: number }> = [];

  constructor(config: AIConfig) {
    this.config = config;
  }

  async chat(messages: AnthropicMessage[]) {
    try {
      // Simulate network latency
      await this.simulateLatency();

      // Log the request
      const prompt = messages[messages.length - 1].content;
      this.requestHistory.push({
        prompt,
        timestamp: Date.now()
      });

      // Simulate rate limiting
      if (this.requestHistory.length > 50) {
        throw new Error('Rate limit exceeded');
      }

      // Simulate token limit errors
      if (prompt.length > 4000) {
        throw new Error('Token limit exceeded');
      }

      return {
        role: 'assistant',
        content: `[Mock Claude] Response to: ${prompt.slice(0, 100)}...`,
      };
    } catch (error) {
      console.error('Anthropic Mock Error:', error);
      throw error;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      await this.simulateLatency();

      // Generate deterministic mock embeddings using a different pattern
      const mockEmbedding = new Array(1024).fill(0).map((_, i) => 
        Math.cos(i * text.length) * 0.1
      );

      return mockEmbedding;
    } catch (error) {
      console.error('Anthropic Embedding Error:', error);
      throw error;
    }
  }

  private async simulateLatency() {
    const latency = Math.random() * 800 + 300; // 300-1100ms
    await new Promise(resolve => setTimeout(resolve, latency));
  }
}