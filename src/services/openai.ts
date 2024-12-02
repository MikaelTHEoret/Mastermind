import OpenAI from 'openai';
import { ModuleConfig } from '../types';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateModule(description: string): Promise<ModuleConfig> {
  const prompt = `Create a React TypeScript module based on this description: "${description}"
  Return a JSON object with:
  - fileName: the name for the module file
  - code: the complete module code
  - description: a brief description of what the module does
  Ensure the code is complete, properly typed, and follows React best practices.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
}

export async function processCommand(command: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are the Central Nexus AI assistant. Help users with their requests and provide clear, concise responses."
      },
      { role: "user", content: command }
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content || "I couldn't process that command.";
}