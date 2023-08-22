import React, { useState, useEffect } from 'react';
import './RestaurantBox.css';

const RestaurantBox = ({ name, data, error, currentDate, showPrices }) => {
  const filteredMenus = data.MenusForDays.filter(
    (menuDay) => menuDay.Date.split('T')[0] === currentDate
  );

  const hasLunchTime = filteredMenus.some((menuDay) => menuDay.hasOwnProperty('LunchTime'));

  const extractImportantPart = (price) => {
    // Check for the old format: "Opiskelija xx,xx"
    const oldRegex = /Opiskelija (\d+,\d+)/;
    const oldMatch = price && price.match(oldRegex);
    
    // Check for the new format: "OP xx,xx" or "xx,xx"
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

  // Add the loaded class after the component is mounted and data is loaded
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    setIsLoaded(true);
  }, []);

  return (
    <div className={`restaurant-box ${isLoaded ? 'loaded' : ''}`}>
      <h2>{name}</h2>
      {error ? (
        <p>Error fetching data: {error}</p>
      ) : filteredMenus.length ? (
        <div className="menu-items">
          {hasLunchTime ? (
            filteredMenus.map((menuDay, index) => (
              <div key={index} className="menu-day">
                {menuDay.LunchTime ? (
                  <p>Avoinna: {menuDay.LunchTime}</p>
                ) : (
                  <p>Ravintola suljettu.</p>
                )}
                <ul className='ul-left'>
                  {menuDay.SetMenus.map((menuItem, innerIndex) => (
                    <li key={innerIndex}>
                      <strong>
                        {menuItem.Name && menuItem.Name.split(/\s+/).filter(part => /^[a-zA-Z]/.test(part)).join(' ').toUpperCase()}
                      </strong>

                      {showPrices ? (
                        <p style={{ "color": "white" }}>
                          Hinta: {extractImportantPart(menuItem.Price)}€
                        </p>
                      ) : (
                        <p></p>
                      )}
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
