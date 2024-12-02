export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface NexusState {
  nexus: any;
  messages: Message[];
  addMessage: (message: Message) => void;
}

export interface ModuleConfig {
  fileName: string;
  code: string;
  description: string;
}

export interface CommandProcessor {
  processCommand: (command: string) => Promise<string>;
}