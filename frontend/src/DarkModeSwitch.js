// src/DarkModeSwitch.js
import React, { useState, useEffect } from 'react';
import './DarkModeSwitch.css';

const DarkModeSwitch = () => {
  // Set light mode as default
  const [isDarkMode, setIsDarkMode] = useState(false); 

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    // Enable dark mode only if saved as 'true'
    setIsDarkMode(savedDarkMode === 'true'); 
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <label className={`switch ${isDarkMode ? 'dark-mode' : ''}`}>
      <style>
        {`
          :root {
            --dark-grey: ${isDarkMode ? '#151a21' : 'rgb(235, 235, 235)'};
            --light-white: ${isDarkMode ? 'rgb(235, 235, 235)' : '#151a21'};
            --darkest-grey: ${isDarkMode ? '#111' : '#fff'};
          }
        `}
      </style>
      <label className="form-switch">
        <input id="toggle" type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
        <i></i>
      </label>
    </label>
  );
};

export default DarkModeSwitch;
