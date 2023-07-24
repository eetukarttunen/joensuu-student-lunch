import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import './App.css';

const apiURL = process.env.REACT_APP_BASE_URL;

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [showPrices, setShowPrices] = useState(false);
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [lastDate, setLastDate] = useState(currentDate); // New state to store the last date in the data

  useEffect(() => {
    fetch(apiURL + '/api/menus')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurantData(data);

          // Find the last date in the data
          const dates = data.map((restaurant) => restaurant.data.MenusForDays).flat();
          const lastDateInData = new Date(Math.max(...dates.map((date) => new Date(date.Date))));
          setLastDate(lastDateInData.toISOString().split('T')[0]);
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


  const goToNextDay = () => {
    const nextDay = new Date(displayDate);
    nextDay.setDate(nextDay.getDate() + 1);
    const nextDayString = nextDay.toISOString().split('T')[0];
    const lastDateObj = new Date(lastDate);

    if (new Date(nextDayString) <= lastDateObj) {
      setDisplayDate(nextDayString);
    }
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(displayDate);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayString = previousDay.toISOString().split('T')[0];
    const currentDateObj = new Date(currentDate);

    if (new Date(previousDayString) >= currentDateObj) {
      setDisplayDate(previousDayString);
    }
  };

// Step 2: Update the function to use the formatted date
const renderDateLabel = () => {
  const tomorrow = new Date(currentDate);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const optionsTodayTomorrow = { day: 'numeric', month: 'long', year: 'numeric' };
  const optionOtherDays = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

  if (displayDate === currentDate) {
    const date = new Date(displayDate);
    return "Tänään " + date.toLocaleDateString('fi-FI', optionsTodayTomorrow);
  } else if (displayDate === tomorrow.toISOString().split('T')[0]) {
    const date = new Date(displayDate);
    return "Huomenna " + date.toLocaleDateString('fi-FI', optionsTodayTomorrow);
  } else {
    const date = new Date(displayDate);
    return date.toLocaleDateString('fi-FI', optionOtherDays);
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
              onClick={goToPreviousDay}
              disabled={displayDate === currentDate}
            >
              ←
            </button>
            <span className="date">{renderDateLabel()}</span>
            <button
              className={`arrow arrow-right-blue ${new Date(displayDate) >= new Date(lastDate) ? 'arrow-disabled' : ''}`}
              onClick={goToNextDay}
              disabled={new Date(displayDate) >= new Date(lastDate)}
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
