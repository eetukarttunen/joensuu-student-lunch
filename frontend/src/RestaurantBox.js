// src/components/RestaurantBox.js
import React from 'react';
import './RestaurantBox.css';

const RestaurantBox = ({ name, data, error }) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const filteredMenus = data.MenusForDays.filter(
    (menuDay) => menuDay.Date.split('T')[0] === currentDate
  );

  
  return (
    <div className="restaurant-box">
      <h2>{name}</h2>
      {error ? (
        <p>Error fetching data: {error}</p>
      ) : filteredMenus.length ? (
        <div className="menu-items">
          {filteredMenus.map((menuDay, index) => (
            <div key={index} className="menu-day">
              {/*<strong>Date: {menuDay.Date}</strong>*/}
              <p>Avoinna tänään: {menuDay.LunchTime}</p>
              <ul className='ul-left'>
                {menuDay.SetMenus.map((menuItem, innerIndex) => (
                  <li key={innerIndex}>
                    <strong>{menuItem.Name}</strong>
                    {/*<p>Price: {menuItem.Price}</p>*/}
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
          ))}
        </div>
      ) : (
        <p className="not-found">Ravintola suljettu.</p>
      )}
    </div>
  );
};

export default RestaurantBox;
