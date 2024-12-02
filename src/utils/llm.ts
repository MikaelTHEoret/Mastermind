import axios from 'axios';

export async function queryLLM(prompt: string) {
  try {
    const response = await axios.post('/api/llm', {
      prompt,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.data.result;
  } catch (error) {
    console.error('LLM query failed:', error);
    throw new Error('Failed to process command through LLM');
  }
}