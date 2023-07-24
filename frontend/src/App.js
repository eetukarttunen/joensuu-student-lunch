import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import './App.css';

const apiURL = process.env.REACT_APP_BASE_URL;

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [showPrices, setShowPrices] = useState(false);
  const [displayDate, setDisplayDate] = useState(currentDate);

  useEffect(() => {
    fetch(apiURL + '/api/menus')
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

  const boxesWithData = restaurantData.filter((restaurant) => restaurant.data && restaurant.data.MenusForDays.length > 0);
  const emptyBoxes = restaurantData.filter((restaurant) => !restaurant.data || restaurant.data.MenusForDays.length === 0);
  const sortedRestaurantData = [...boxesWithData, ...emptyBoxes];

  const goToToday = () => {
    setDisplayDate(currentDate);
  };

  const goToTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDisplayDate(tomorrow.toISOString().split('T')[0]);
  };

  // Step 1: Format the date as "date month year" using toLocaleDateString method
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fi-FI', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Step 2: Update the function to use the formatted date
  const renderDateLabel = () => {
    if (displayDate === currentDate) {
      return "Tänään ";
    } else {
      return "Huomenna ";
    }
  };

  return (
    <>
      <div className='App-info'>
        <h1 className='page-header'>Päivän opiskelijaruoka</h1>
        <p className="page-info">
          Kaikki Joensuun alueen yliopisto -ja AMK-ruokaloiden listat samassa näkymässä! &#129382;
          <br />
        </p>
        <p className="page-settings">
          <label className="form-switch">
            <input type="checkbox" checked={showPrices} onChange={() => setShowPrices(!showPrices)} />
            <i></i>
            Näytä hinnasto, jos saatavilla
          </label>
        </p>
        <p className="page-settings">
          <div className="date-navigation">
            <button
              className={`arrow arrow-left-blue ${displayDate === currentDate ? 'arrow-disabled' : ''}`}
              onClick={goToToday}
              disabled={displayDate === currentDate}
            >
              ←
            </button>
            <span className="date">{renderDateLabel()}{formatDate(displayDate)}</span>
            <button
              className={`arrow arrow-right-blue ${displayDate !== currentDate ? 'arrow-disabled' : ''}`}
              onClick={goToTomorrow}
              disabled={displayDate !== currentDate}
            >
              →
            </button>
          </div>
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
              currentDate={displayDate}
              showPrices={showPrices}
            />
          ))}
        </div>
      </div>
      <footer><a href="https://github.com/eetukarttunen">Copyright © 2023 ietu</a></footer>
    </>
  );
};

export default App;
