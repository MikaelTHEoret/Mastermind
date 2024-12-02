
import React from 'react';
import MultiLLMSelector from './bolt-new/MultiLLMSelector';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Application Dashboard</h1>
      <div className="llm-selector-section">
        <h2>Choose an LLM</h2>
        <MultiLLMSelector />
      </div>
      {/* Other dashboard content can go here */}
    </div>
  );
};

export default Dashboard;
