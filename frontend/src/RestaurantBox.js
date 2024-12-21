import React, { useState, useEffect } from 'react';
import './RestaurantBox.css';

const RestaurantBox = ({ name, data, error, currentDate, onTogglePin, filterSpecial, filterDessert }) => {
  const isPinned = localStorage.getItem('pinnedRestaurants')?.includes(name);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize visibility state based on localStorage, default to true if not present
  const [isVisible, setIsVisible] = useState(
    localStorage.getItem(`restaurantVisibility-${name}`) !== 'false'
  );

  // Set isLoaded to true after the first render
  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Save visibility state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem(`restaurantVisibility-${name}`, isVisible);
  }, [isVisible, name]);  // Include `name` as a dependency here

  const handleTogglePin = () => {
    onTogglePin(name);
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const filteredMenus = data.MenusForDays.filter(
    (menuDay) => menuDay.Date.split('T')[0] === currentDate
  );

  const hasLunchTime = filteredMenus.some((menuDay) => menuDay.hasOwnProperty('LunchTime'));
  const hasComponents = filteredMenus.some((menuDay) =>
    menuDay.SetMenus && menuDay.SetMenus.some((setMenu) => setMenu.Components && setMenu.Components.length > 0)
  );

  const extractImportantPart = (price) => {
    const oldRegex = /Opiskelija (\d+,\d+)/;
    const oldMatch = price && price.match(oldRegex);
    const newRegex = /(?:OP )?(\d+,\d+)/;
    const newMatch = price && price.match(newRegex);

    if (oldMatch) {
      return oldMatch[1];
    } else if (newMatch) {
      if (newMatch[0].startsWith('OP')) {
        return newMatch[1];
      } else {
        return newMatch[0];
      }
    } else {
      return null;
    }
  };

  const filterSetSpecial = (setMenu) => {
    const cleanName = setMenu.Name ? setMenu.Name.replace(/\s/g, "") : "";
    const isErikoisannosFiltered = filterSpecial && (
      cleanName === 'Erikoisannos' || 
      setMenu.Name === 'BISTRON JÄLKIRUOKA' || 
      cleanName === 'POPUPGRILL' || 
      cleanName === 'Grillistä'
    );
    
    return !(isErikoisannosFiltered);
  };
  
  const filterSetDessert = (setMenu) => {
    const cleanName = setMenu.Name ? setMenu.Name.replace(/\s/g, "") : "";
    const isErikoisannosFiltered = filterDessert && (
      cleanName === 'Jälkiruoka' || 
      setMenu.Name === 'BISTRON JÄLKIRUOKA'
    );
    
    return !(isErikoisannosFiltered);
  };

  return (
    <div className={`restaurant-box ${isLoaded ? 'loaded' : ''}`}>
      <div className="header" onClick={handleToggleVisibility} style={{ cursor: 'pointer' }}>
        <h2>{name}</h2>
        <i className={`fa ${isVisible ? 'fa-chevron-down' : 'fa-chevron-right'} toggle-icon`} />
      </div>
      <i
        className={`fa ${isPinned ? 'fa-thumb-tack pinned' : 'fa-thumb-tack unpinned'}`}
        onClick={handleTogglePin}
      />

      {isVisible && (
        <>
          {error ? (
            <p>Error fetching data: {error}</p>
          ) : filteredMenus.length ? (
            <div className="menu-items">
              {hasLunchTime && hasComponents ? (
                filteredMenus.map((menuDay, index) => (
                  <div key={index} className="menu-day">
                    {menuDay.LunchTime ? (
                      <p>Avoinna: {menuDay.LunchTime}</p>
                    ) : (
                      <p>Ravintola suljettu.</p>
                    )}
                    <br />
                    <ul className="ul-left">
                      {menuDay.SetMenus
                        .filter(filterSetSpecial)
                        .filter(filterSetDessert)
                        .filter(menuItem => menuItem.Name && menuItem.Price)
                        .map((menuItem, innerIndex) => (
                          <li key={innerIndex}>
                            <strong>
                              {menuItem.Name && menuItem.Name.toUpperCase()} {extractImportantPart(menuItem.Price)}€
                            </strong>
                            <ul>
                              {menuItem.Components.map((component, componentIndex) => (
                                <li key={componentIndex}>{component}</li>
                              ))}
                            </ul>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))
              ) : (
                <p className="not-found">Ravintola suljettu.</p>
              )}
            </div>
          ) : (
            <p className="not-found">Ravintola suljettu.</p>
          )}
        </>
      )}
    </div>
  );
};

export default RestaurantBox;
