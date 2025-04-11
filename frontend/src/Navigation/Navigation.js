import React, { useEffect, useState, useRef } from 'react';
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
        <h1 className='page-header'>Opiskelijaruoka Joensuu</h1>
        
      </div>
    </nav>
  );
};

export default Navigation;
