
export const createLLMHandler = (modelName) => {
  return async (prompt) => {
    // Simulate an API call for LLM response
    console.log(`Using model: ${modelName}, prompt: ${prompt}`);
    return `Response from ${modelName}`;
  };
};
