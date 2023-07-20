// src/components/RestaurantBox.js
import React from 'react';

const RestaurantBox = ({ name, data, error }) => {
  const currentDate = new Date().toISOString().split('T')[0];
  const filteredMenus = data.MenusForDays.filter(
    (menuDay) => menuDay.Date.split('T')[0] === currentDate
  );

  return (
    <div className="restaurant-box">
      <h3>{name}</h3>
      {error ? (
        <p>Error fetching data: {error}</p>
      ) : filteredMenus.length ? (
        <ul>
          {filteredMenus.map((menuDay, index) => (
            <li key={index}>
              {/*<strong>Date: {menuDay.Date}</strong>*/}
              <p>Avoinna: {menuDay.LunchTime}</p>
              <ul>
                {menuDay.SetMenus.map((menuItem, innerIndex) => (
                  <li key={innerIndex}>
                    <strong>{menuItem.Name}</strong>
                    {/*<p>Price: {menuItem.Price}</p>*/}
                    <ul>
                      {menuItem.Components.map((component, componentIndex) => (
                        <li key={componentIndex}>{component}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Ravintolan {name} lista ei ole saatavilla</p>
      )}
    </div>
  );
};

export default RestaurantBox;
