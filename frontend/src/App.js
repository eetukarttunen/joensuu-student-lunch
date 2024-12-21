import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import './App.css';
import PanLoader from './PanLoader';
import Navigation from './Navigation/Navigation';
import { Analytics } from "@vercel/analytics/react";

const apiURL = process.env.REACT_APP_BASE_URL;
const apiKey = process.env.REACT_APP_API_KEY;

const CACHE_KEY = 'menusData';
const CACHE_TIMESTAMP_KEY = 'menusTimestamp';
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 60 minutes in milliseconds untill cache expires.

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [lastDate, setLastDate] = useState(currentDate);
  const [isLoading, setIsLoading] = useState(true);
  const initialPinnedRestaurants = JSON.parse(localStorage.getItem('pinnedRestaurants')) || [];
  const [pinnedRestaurants, setPinnedRestaurants] = useState(initialPinnedRestaurants);
  
  const [filterSpecial, setFilterSpecial] = useState(() => {
    return JSON.parse(localStorage.getItem('filterSpecial')) || false;
  });
  const [filterDessert, setFilterDessert] = useState(() => {
    return JSON.parse(localStorage.getItem('filterDessert')) || false;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('isDarkMode')) || false;
  });

  const handleTogglePin = (restaurantName) => {
    const updatedPinnedRestaurants = pinnedRestaurants.includes(restaurantName)
      ? pinnedRestaurants.filter(name => name !== restaurantName)
      : [...pinnedRestaurants, restaurantName];

    setPinnedRestaurants(updatedPinnedRestaurants);
    localStorage.setItem('pinnedRestaurants', JSON.stringify(updatedPinnedRestaurants));
  };

  useEffect(() => {
    // Try to fetch from cache first
    const cachedData = JSON.parse(localStorage.getItem(CACHE_KEY));
    const cachedTimestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    const currentTime = new Date().getTime();

    if (cachedData && cachedTimestamp && (currentTime - cachedTimestamp < CACHE_EXPIRATION_TIME)) {
      setRestaurantData(cachedData);
      setIsLoading(false);
    } else {
      // Fetch new data if cache is expired or doesn't exist
      fetch(apiURL + '/api/menus', {
        method: 'GET',
        headers: {
          'x-api-key': apiKey,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            setRestaurantData(data);
            const dates = data.map((restaurant) => restaurant.data.MenusForDays).flat();
            const lastDateInData = new Date(Math.max(...dates.map((date) => new Date(date.Date))));
            setLastDate(lastDateInData.toISOString().split('T')[0]);

            // Store the data and timestamp in localStorage
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIMESTAMP_KEY, currentTime.toString());
          } else {
            console.error('Invalid data format received:', data);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setIsLoading(false);
        });
    }
  }, []);

  const sortedRestaurantData = [...restaurantData];
  sortedRestaurantData.sort((a, b) => {
    const aIsPinned = pinnedRestaurants.includes(a.name);
    const bIsPinned = pinnedRestaurants.includes(b.name);

    if (aIsPinned && !bIsPinned) {
      return -1;
    } else if (!aIsPinned && bIsPinned) {
      return 1;
    } else if (aIsPinned && bIsPinned) {
      return a.name.localeCompare(b.name);
    } else if (a.data.MenusForDays.length > 0 && b.data.MenusForDays.length > 0) {
      return a.name.localeCompare(b.name);
    } else if (a.data.MenusForDays.length > 0) {
      return -1;
    } else {
      return 1;
    }
  });

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

  const renderDateLabel = () => {
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const optionsTodayTomorrow = { day: 'numeric', month: 'numeric', year: 'numeric' };
    const optionOtherDays = { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' };

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
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <div className='App-info'>
        <Navigation 
          setFilterSpecial={setFilterSpecial} 
          filterSpecial={filterSpecial} 
          setFilterDessert={setFilterDessert} 
          filterDessert={filterDessert} 
          setDarkMode={setIsDarkMode} 
          isDarkMode={isDarkMode} 
        />

        <p className="page-info">
          Kaikki Joensuun alueen yliopisto- ja AMK-ruokaloiden listat samassa näkymässä! &#129382; 
          <br />
        </p>
        <div className="page-settings">
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
        </div>
      </div>

      <div className="App">
        <div className="Content">
          {isLoading ? (
            <PanLoader />
          ) : (
            sortedRestaurantData.map((restaurant, index) => (
              <RestaurantBox
                key={index}
                name={restaurant.name}
                data={restaurant.data}
                error={restaurant.error}
                currentDate={displayDate}
                onTogglePin={handleTogglePin}
                filterSpecial={filterSpecial}
                filterDessert={filterDessert}
              />
            ))
          )}
        </div>
      </div>
      <footer>
        <a href="https://github.com/eetukarttunen">Copyright © 2024 ietu</a>
      </footer>
      <Analytics />
    </div>
  );
};

export default App;
