import React, { useState, useEffect } from 'react';
import './DarkModeSwitch.css';

const DarkModeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [colors, setColors] = useState({
    darkGrey: '#141414',
    lightWhite: 'rgb(235, 235, 235)',
    darkestGrey: '#111',
  });

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    setIsDarkMode(savedDarkMode === 'true' || savedDarkMode === null);
  }, []);
  

  useEffect(() => {
    updateColors(isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  const updateColors = (isDarkMode) => {
    if (isDarkMode) {
      setColors({
        darkGrey: '#151a21',
        lightWhite: 'rgb(235, 235, 235)',
        darkestGrey: '#111',
      });
    } else {
      setColors({
        darkGrey: 'rgb(235, 235, 235)',
        lightWhite: '#151a21',
        darkestGrey: '#fff',
      });
    }
  };

  return (
    <label className={`switch ${isDarkMode ? 'dark-mode' : ''}`}>
      <input id="toggle" type="checkbox" checked={isDarkMode} onChange={toggleDarkMode} />
      <span className="slider">
        <i className={`fas ${isDarkMode ? 'fa-moon' : 'fa-sun'}`}></i>
      </span>
      <style>
        {`
          :root {
            --dark-grey: ${colors.darkGrey};
            --light-white: ${colors.lightWhite};
            --darkest-grey: ${colors.darkestGrey};
          }
        `}
      </style>
    </label>
  );
};

export default DarkModeSwitch;
