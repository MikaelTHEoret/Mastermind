
import React from 'react';

const MultiLLMSelector = () => {
  return (
    <div>
      <h2>Select an LLM</h2>
      <select>
        <option value="gpt-4">GPT-4</option>
        <option value="claude">Claude</option>
        <option value="llama">Llama</option>
      </select>
    </div>
  );
};

export default MultiLLMSelector;
