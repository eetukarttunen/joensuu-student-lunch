// src/Navigation/Navigation.js
import React from 'react';
//import LanguageSwitcher from '../Components/LanguageSwitcher';
//import { useLanguage } from '../Components/LanguageContext';
import DarkModeSwitcher from '../DarkModeSwitch';
import './Navigation.css';

const Navigation = () => {


  return (
    <nav className="navigation">
      <div className="navbar-container">
      <h1 className='page-header'>Päivän opiskelijaruoka</h1>
        <div className="navbar-links">
          <br/>
          <DarkModeSwitcher/>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
