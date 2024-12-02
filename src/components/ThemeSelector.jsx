
import React, { useState } from 'react';
import { applyTheme } from '../themes/theme-switcher';

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState('galacticPulse');

  const handleThemeChange = (event) => {
    const themeName = event.target.value;
    setSelectedTheme(themeName);
    applyTheme(themeName);
  };

  return (
    <div className="theme-selector">
      <label htmlFor="theme">Choose Theme:</label>
      <select id="theme" value={selectedTheme} onChange={handleThemeChange}>
        <option value="galacticPulse">Galactic Pulse</option>
        <option value="sereneCircle">Serene Circle</option>
      </select>
    </div>
  );
};

export default ThemeSelector;
