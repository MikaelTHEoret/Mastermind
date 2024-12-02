import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const sendCommand = async (command: string) => {
  try {
    const response = await api.post('/command', { command });
    return response.data.result;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export default api;