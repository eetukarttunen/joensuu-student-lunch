import React, { useState, useEffect } from 'react';
import './RestaurantBox.css';

const RestaurantBox = ({ name, data, error, currentDate, onTogglePin, filterSpecial, filterDessert }) => {
  const isPinned = localStorage.getItem('pinnedRestaurants')?.includes(name);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleTogglePin = () => {
    onTogglePin(name);
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

  // Function to filter out specific SetMenus based on the global filter and local filter
  const filterSetSpecial = (setMenu) => {
    const isErikoisannosFiltered = filterSpecial && (setMenu.Name === 'Erikoisannos' || setMenu.Name === 'BISTRON JÄLKIRUOKA' || setMenu.Name === 'POP UP GRILL' || setMenu.Name === 'Grillistä');

    return !(isErikoisannosFiltered);
  };

  const filterSetDessert = (setMenu) => {
    const isErikoisannosFiltered = filterDessert && (setMenu.Name === 'Jälkiruoka' || setMenu.Name === 'BISTRON JÄLKIRUOKA');

    return !(isErikoisannosFiltered);
  };

  return (
    <div className={`restaurant-box ${isLoaded ? 'loaded' : ''}`}>
      <h2>{name}</h2>
      <i
        className={`fa ${isPinned ? 'fa-thumb-tack pinned' : 'fa-thumb-tack unpinned'}`}
        onClick={handleTogglePin}
      />

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
                <ul className='ul-left'>
                  {menuDay.SetMenus
                    .filter(filterSetSpecial)
                    .filter(filterSetDessert)
                    .filter(menuItem => menuItem.Name && menuItem.Price) // Add this filter
                    .map((menuItem, innerIndex) => (
                      <li key={innerIndex}>
                        <strong>
                          {menuItem.Name && menuItem.Name.toUpperCase()} {extractImportantPart(menuItem.Price)}€
                        </strong>
                        <ul>
                          {menuItem.Components.map((component, componentIndex) => (
                            <li key={componentIndex}>
                              {component}
                            </li>
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
    </div>
  );
};

export default RestaurantBox;
