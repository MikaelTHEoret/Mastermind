import React from 'react';
import { Terminal } from 'lucide-react';
import { useNexusStore } from '../stores/nexusStore';
import type { Message } from '../types';

interface NexusTerminalProps {
  logs: any[];
  core: any;
}

export default function NexusTerminal({ logs, core }: NexusTerminalProps) {
  const [input, setInput] = React.useState('');
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content: 'Central Nexus Terminal initialized. How may I assist you?',
    },
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      // Process command through Central Nexus
      const response = await core.processCommand(input);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: `Error: ${error.message}` },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 rounded-lg border border-gray-800">
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <Terminal className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">Central Nexus Terminal</h2>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-4 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-100'
              }`}
            >
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter command..."
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"
        />
      </form>
    </div>
  );
}