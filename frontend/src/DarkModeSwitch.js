import React, { useState, useEffect } from 'react';
import './DarkModeSwitch.css';

const DarkModeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.classList.toggle('dark-mode', newDarkMode); 
  };

  return (
    <div className="dark-mode-switch">
      <label className="form-switch">
        <input
          id="toggle"
          type="checkbox"
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
        <i></i>
      </label>
    </div>
  );
};

export default DarkModeSwitch;
