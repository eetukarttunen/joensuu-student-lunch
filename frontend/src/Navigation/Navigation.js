import React, { useEffect, useState, useRef } from 'react';
import DarkModeSwitcher from '../DarkModeSwitch';
import './Navigation.css';

const Navigation = ({ setFilterSpecial, filterSpecial, setFilterDessert, filterDessert }) => {
  const [isActive, setIsActive] = useState(false);
  const navRef = useRef(null);

  const toggleActiveClass = () => {
    setIsActive(!isActive);
  };

  const handleClickOutside = (event) => {
    if (navRef.current && !navRef.current.contains(event.target)) {
      setIsActive(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('filterSpecial', JSON.stringify(filterSpecial));
  }, [filterSpecial]);

  useEffect(() => {
    localStorage.setItem('filterDessert', JSON.stringify(filterDessert));
  }, [filterDessert]);

  return (
    <nav className="navigation" ref={navRef}>
      <div className={"navbar"}>
        <h1 className='page-header'>Päivän opiskelijaruoka</h1>
        <ul className={`navMenu ${isActive ? "active" : ''}`} >
          <li className="textAndSwitch">
            <span className="menu-label">Tumma teema</span>
            <DarkModeSwitcher />
          </li>
          <li className="textAndSwitch" onClick={toggleActiveClass}>
            <span className="menu-label">Piilota erikoisannokset</span>
            <label className="form-switch">
              <input type="checkbox" checked={filterSpecial} onChange={() => setFilterSpecial(!filterSpecial)} />
              <i></i>
            </label>
          </li>
          <li className="textAndSwitch" onClick={toggleActiveClass}>
            <span className="menu-label">Piilota jälkiruoka</span>
            <label className="form-switch">
              <input type="checkbox" checked={filterDessert} onChange={() => setFilterDessert(!filterDessert)} />
              <i></i>
            </label>
          </li>
        </ul>
        <div className={`fa fa-gear ${isActive ? "active" : ''}`} onClick={toggleActiveClass}/>
      </div>
    </nav>
  );
};

export default Navigation;
