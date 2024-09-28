// src/Navigation/Navigation.js
import React, { useState, useEffect } from 'react';
//import LanguageSwitcher from '../Components/LanguageSwitcher';
//import { useLanguage } from '../Components/LanguageContext';
import DarkModeSwitcher from '../DarkModeSwitch';
import './Navigation.css';

const Navigation = () => {

// adding the states 
const [isActive, setIsActive] = useState(false);
//add the active class
const toggleActiveClass = () => {
  setIsActive(!isActive);
};
//clean up function to remove the active class
const removeActive = () => {
  setIsActive(false)
}
return (
  <nav className="navigation">
      <div className={"navbar"}>
        {/* logo */}
        <h1 className='page-header'>Päivän opiskelijaruoka</h1>
        <ul className={`navMenu ${isActive ? "active" : ''}`}>
          <li onClick={removeActive}>
            <DarkModeSwitcher/>
          </li>
        </ul>
        <div className={`hamburger ${isActive ? "active" : ''}`}  onClick={toggleActiveClass}>
          <span className={"bar"}></span>
          <span className={"bar"}></span>
          <span className={"bar"}></span>
        </div>
      </div>
</nav>
);
};
export default Navigation;
