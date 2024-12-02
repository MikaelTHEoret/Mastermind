import { Ollama } from 'ollama';
import OpenAI from 'openai';
import { DatabaseManager } from './database/DatabaseManager';

export class LLMManager {
  private ollama: Ollama;
  private openai: OpenAI | null = null;
  private db: DatabaseManager;
  private currentProvider: 'ollama' | 'openai' = 'ollama';

  constructor(dbManager: DatabaseManager) {
    this.ollama = new Ollama();
    this.db = dbManager;
  }

  async setProvider(provider: 'ollama' | 'openai', apiKey?: string): Promise<void> {
    this.currentProvider = provider;
    
    if (provider === 'openai' && apiKey) {
      this.openai = new OpenAI({ apiKey });
    }
  }

  async processCommand(command: string, context?: any): Promise<string> {
    try {
      // Get relevant context from vector database
      const contextData = context || await this.getContext(command);
      
      if (this.currentProvider === 'openai' && this.openai) {
        return this.processWithOpenAI(command, contextData);
      } else {
        return this.processWithOllama(command, contextData);
      }
    } catch (error) {
      console.error('LLM processing error:', error);
      throw error;
    }
  }

  private async processWithOpenAI(command: string, context: any): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not configured');

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are the Mastermind AI assistant." },
        { role: "user", content: `Context: ${JSON.stringify(context)}\nCommand: ${command}` }
      ]
    });

    return response.choices[0].message.content || '';
  }

  private async processWithOllama(command: string, context: any): Promise<string> {
    const response = await this.ollama.generate({
      model: 'llama2',
      prompt: `Context: ${JSON.stringify(context)}\nCommand: ${command}`,
      options: {
        temperature: 0.7
      }
    });

    return response.output;
  }

  private async getContext(command: string): Promise<any> {
    // Get embeddings
    const embedding = await this.getEmbedding(command);
    
    // Search vector database
    const results = await this.db.searchSimilar(embedding);
    
    return results;
  }

  private async getEmbedding(text: string): Promise<number[]> {
    if (this.openai) {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
      });
      return response.data[0].embedding;
    }
    
    // Fallback to local embedding
    return this.ollama.embeddings({
      model: 'llama2',
      prompt: text
    });
  }
}