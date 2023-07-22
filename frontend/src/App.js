import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import './App.css';

const apiURL = process.env.REACT_APP_BASE_URL;
console.log(process.env.REACT_APP_TESTI)

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetch(apiURL + '/api/menus')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurantData(data);
          console.log(data);
        } else {
          console.error('Invalid data format received:', data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const boxesWithData = restaurantData.filter((restaurant) => restaurant.data && restaurant.data.MenusForDays.length > 0);
  const emptyBoxes = restaurantData.filter((restaurant) => !restaurant.data || restaurant.data.MenusForDays.length === 0);
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
        {/*<div>Päivämäärä: {currentDate}</div>*/}


        {sortedRestaurantData.map((restaurant) => (
          <RestaurantBox
            key={restaurant.name}
            name={restaurant.name}
            data={restaurant.data}
            error={restaurant.error}
            currentDate={currentDate}
          />
        ))}
      </div>
    </div>
    <footer><a href="https://github.com/eetukarttunen">Copyright © 2023 ietu</a></footer>
  </>
  );
};

export default App;
