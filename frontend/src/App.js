// src/App.js
import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import "./App.css";

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);

  useEffect(() => {
    fetch('/menus')
      .then((response) => response.json())
      .then((data) => {
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

  // Separate boxes with data from empty boxes
  const boxesWithData = restaurantData.filter((restaurant) => restaurant.data && restaurant.data.MenusForDays.length > 0);
  const emptyBoxes = restaurantData.filter((restaurant) => !restaurant.data || restaurant.data.MenusForDays.length === 0);

  // Concatenate the arrays with data-first order
  const sortedRestaurantData = [...boxesWithData, ...emptyBoxes];

  return (<>
    <div className='App-info'>
      <h1 className='page-header'>Päivän opiskelijaruoka</h1>
      <p className="page-info">
        Kaikki Joensuun alueen yliopisto -ja AMK-ruokaloiden listat samassa näkymässä! &#129382;
      </p>
    </div>
    <div className="App">

      <div className="Content">

        {sortedRestaurantData.map((restaurant) => (
          <RestaurantBox
            key={restaurant.name}
            name={restaurant.name}
            data={restaurant.data}
            error={restaurant.error}
          />
        ))}
      </div>
    </div>
    <footer><a href="https://github.com/eetukarttunen">Copyright © 2023 ietu</a></footer>
  </>
  );
};

export default App;
