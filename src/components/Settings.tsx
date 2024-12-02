
import React, { useState } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState('customDark');

  const handleThemeChange = (event) => {
    const selectedTheme = event.target.value;
    setTheme(selectedTheme);
    document.documentElement.classList.remove('customDark', 'customLight');
    document.documentElement.classList.add(selectedTheme);
  };

  return (
    <div className="settings-panel">
      <h2>Settings</h2>
      <label htmlFor="theme-select">Theme:</label>
      <select id="theme-select" value={theme} onChange={handleThemeChange}>
        <option value="customDark">Dark Theme</option>
        <option value="customLight">Light Theme</option>
      </select>
    </div>
  );
};

export default Settings;
