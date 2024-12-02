
import React, { useState } from 'react';
import { sendCommandToWizard } from './wizardService';

const WizardAssistant = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSendCommand = async () => {
    if (!userInput.trim()) return;
    const userMessage = { role: 'user', content: userInput };
    setConversation((prev) => [...prev, userMessage]);

    // Send the command to the Wizard AI service
    const wizardResponse = await sendCommandToWizard(userInput);
    const wizardMessage = { role: 'wizard', content: wizardResponse };
    setConversation((prev) => [...prev, wizardMessage]);
    setUserInput('');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a2e', color: '#f0f0f0' }}>
      <h2>Great Wizard Assistant 🧙‍♂️</h2>
      <div style={{ marginBottom: '20px', maxHeight: '300px', overflowY: 'auto', backgroundColor: '#16213e', padding: '10px', borderRadius: '5px' }}>
        {conversation.map((message, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <strong>{message.role === 'user' ? 'You' : 'Wizard'}:</strong> {message.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={userInput}
        onChange={handleInputChange}
        placeholder="Ask the Wizard anything..."
        style={{ padding: '10px', width: '80%', borderRadius: '5px', marginRight: '10px' }}
      />
      <button onClick={handleSendCommand} style={{ padding: '10px', backgroundColor: '#0f3460', color: '#f0f0f0', border: 'none', borderRadius: '5px' }}>
        Send
      </button>
    </div>
  );
};

export default WizardAssistant;
