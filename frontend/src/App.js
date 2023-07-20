// src/App.js
import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/menus')
    .then((response) => response.json())
    .then((data) => {
      console.log('Received data:', data);
      if (Array.isArray(data)) {
        setRestaurantData(data);
      } else {
        console.error('Invalid data format received:', data);
      }
    })
    .catch((error) => {
      console.error('Error fetching data:', error);
    });
}, []);

  return (
    <div className="app">
      {restaurantData.map((restaurant) => (
        <RestaurantBox
          key={restaurant.name}
          name={restaurant.name}
          data={restaurant.data}
          error={restaurant.error}
        />
      ))}
    </div>
  );
};

export default App;
