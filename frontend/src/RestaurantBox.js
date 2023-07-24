import React from 'react';
import './RestaurantBox.css';

const RestaurantBox = ({ name, data, error, currentDate, showPrices }) => {
  const filteredMenus = data.MenusForDays.filter(
    (menuDay) => menuDay.Date.split('T')[0] === currentDate
  );

  const hasLunchTime = filteredMenus.some((menuDay) => menuDay.hasOwnProperty('LunchTime'));

  // Helper function to extract the important part of the price
  const extractImportantPart = (price) => {
    const regex = /Opiskelija (\d+,\d+)/;
    const match = price.match(regex);
    return match ? match[0] : null;
  };

  return (
    <div className="restaurant-box">
      <h2>{name}</h2>
      {error ? (
        <p>Error fetching data: {error}</p>
      ) : filteredMenus.length ? (
        <div className="menu-items">
          {hasLunchTime ? (
            filteredMenus.map((menuDay, index) => (
              <div key={index} className="menu-day">
                {menuDay.LunchTime ? (
                  <p>Avoinna tänään: {menuDay.LunchTime}</p>
                ) : (
                  <p>Ravintola suljettu.</p>
                )}
                <ul className='ul-left'>
                  {menuDay.SetMenus.map((menuItem, innerIndex) => (
                    <li key={innerIndex}>
                      <strong>{menuItem.Name}</strong>
                      {showPrices ? (
                        <p style={{"color": "white"}}>
                          {extractImportantPart(menuItem.Price)}€
                        </p>
                      ) : (
                        <p style={{"visibility": "hidden", display: 'none'}}></p>
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
