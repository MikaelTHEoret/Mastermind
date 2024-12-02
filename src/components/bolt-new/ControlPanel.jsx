
import React, { useState, useEffect } from 'react';
import NexusAI from '../../core/NexusAI';

const ControlPanel = () => {
  const [modules, setModules] = useState([]);
  const [features, setFeatures] = useState([]);
  const [commandInput, setCommandInput] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    // Fetch the list of modules and features on load
    setModules(NexusAI.listModules());
    setFeatures(NexusAI.listFeatures());
  }, []);

  const handleLoadModule = async () => {
    const moduleName = prompt('Enter module name:');
    const modulePath = prompt('Enter module path:');
    if (moduleName && modulePath) {
      await NexusAI.loadModule(moduleName, modulePath);
      setModules(NexusAI.listModules());
      setFeatures(NexusAI.listFeatures());
      alert(`Module '${moduleName}' loaded successfully!`);
    }
  };

  const handleExecuteFeature = () => {
    if (commandInput.trim() === '') return;
    try {
      const result = NexusAI.callFeature(commandInput);
      setOutput(result || 'Executed successfully!');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
    setCommandInput('');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a2e', color: '#f0f0f0' }}>
      <h1>Mastermind Control Panel 🧠</h1>
      <div style={{ marginBottom: '20px' }}>
        <h2>Loaded Modules</h2>
        <ul>
          {modules.map((module, index) => (
            <li key={index}>{module}</li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <h2>Available Features</h2>
        <ul>
          {features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
      </div>
      <button
        onClick={handleLoadModule}
        style={{
          padding: '10px',
          backgroundColor: '#0f3460',
          color: '#f0f0f0',
          border: 'none',
          borderRadius: '5px',
          marginBottom: '20px',
        }}
      >
        Load New Module
      </button>
      <div style={{ marginBottom: '20px' }}>
        <h2>Execute Feature</h2>
        <input
          type="text"
          value={commandInput}
          onChange={(e) => setCommandInput(e.target.value)}
          placeholder="Enter feature name..."
          style={{ padding: '10px', width: '80%', borderRadius: '5px', marginRight: '10px' }}
        />
        <button
          onClick={handleExecuteFeature}
          style={{ padding: '10px', backgroundColor: '#0f3460', color: '#f0f0f0', border: 'none', borderRadius: '5px' }}
        >
          Execute
        </button>
      </div>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#16213e', borderRadius: '5px' }}>
        <h3>Output</h3>
        <pre>{output}</pre>
      </div>
    </div>
  );
};

export default ControlPanel;
