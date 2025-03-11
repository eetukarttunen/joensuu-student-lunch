import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import './App.css';
import PanLoader from './PanLoader';
import Navigation from './Navigation/Navigation';
import { Analytics } from "@vercel/analytics/react";
import PageInfo from './PageInfo';
import Footer from './Footer';
import PageSettings from './PageSettings';

const apiURL = process.env.REACT_APP_BASE_URL;

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const currentDate = new Date().toISOString().split('T')[0];
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [lastDate, setLastDate] = useState(currentDate);
  const [isLoading, setIsLoading] = useState(true);
  const initialPinnedRestaurants = JSON.parse(localStorage.getItem('pinnedRestaurants')) || [];
  const [pinnedRestaurants, setPinnedRestaurants] = useState(initialPinnedRestaurants);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    document.body.classList.toggle('dark-mode', savedDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.classList.toggle('dark-mode', newDarkMode);
  };
  const [filterCategory, setFilterCategory] = useState(() => {
    return localStorage.getItem('filterCategory') || '';
  });
  const [filterSpecial, setFilterSpecial] = useState(() => {
    return JSON.parse(localStorage.getItem('filterSpecial')) || false;
  });
  const [filterDessert, setFilterDessert] = useState(() => {
    return JSON.parse(localStorage.getItem('filterDessert')) || false;
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return JSON.parse(localStorage.getItem('isDarkMode')) || false;
  });
  const API_ERROR_MESSAGE = 'Häiriö Fazer Food & Co rajapinnassa. Listat palaavat näkyviin häiriön korjauduttua.';
  const handleTogglePin = (restaurantName) => {
    const updatedPinnedRestaurants = pinnedRestaurants.includes(restaurantName)
      ? pinnedRestaurants.filter(name => name !== restaurantName)
      : [...pinnedRestaurants, restaurantName];

    setPinnedRestaurants(updatedPinnedRestaurants);
    localStorage.setItem('pinnedRestaurants', JSON.stringify(updatedPinnedRestaurants));
  };

  const handleCategoryToggle = (category) => {
    setErrorMessage('');
    setIsLoading(true);

    if (filterCategory === "") {
      setFilterCategory(category);
      localStorage.setItem('filterCategory', category);
    } else if (filterCategory === category) {
      setFilterCategory("");
      localStorage.setItem('filterCategory', "");
    } else {
      setFilterCategory("");
      localStorage.setItem('filterCategory', "");
    }
  };

  useEffect(() => {
    localStorage.setItem('filterSpecial', JSON.stringify(filterSpecial));
  }, [filterSpecial]);

  useEffect(() => {
    localStorage.setItem('filterDessert', JSON.stringify(filterDessert));
  }, [filterDessert]);

  useEffect(() => {
    let url = `${apiURL}/api/menus`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setRestaurantData(data);
          const dates = data.map((restaurant) => restaurant.data.MenusForDays).flat();
          const validDates = dates.filter(date => !isNaN(new Date(date.Date).getTime()));
          if (validDates.length > 0) {
            const lastDateInData = new Date(Math.max(...validDates.map((date) => new Date(date.Date))));
            setLastDate(lastDateInData.toISOString().split('T')[0]);
          } else {
            setLastDate(currentDate);
          }
        } else {
          setRestaurantData([]);
          setErrorMessage(API_ERROR_MESSAGE);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setErrorMessage(API_ERROR_MESSAGE);
      });
  }, [filterCategory]);

  useEffect(() => {
    if (!restaurantData || restaurantData.length === 0) return;

    let filteredData = [...restaurantData];

    if (filterCategory) {
      filteredData = filteredData.filter(restaurant => restaurant.category === filterCategory);
    }
    setFilteredData(filteredData);
  }, [filterSpecial, filterDessert, filterCategory, restaurantData]);

  const sortedRestaurantData = [...filteredData];
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
      <div className="App-info">
        <Navigation
          setFilterSpecial={setFilterSpecial}
          filterSpecial={filterSpecial}
          setFilterDessert={setFilterDessert}
          filterDessert={filterDessert}
          setDarkMode={setIsDarkMode}
          isDarkMode={isDarkMode}
        />

        <PageInfo errorMessage={errorMessage} />

        <div className="category-filter">
          <button
            onClick={() => handleCategoryToggle("UEF")}
            className={filterCategory === "" || filterCategory === "UEF" ? "active" : ""}
          >
            Yliopiston ravintolat
          </button>

          <button
            onClick={() => handleCategoryToggle("Karelia")}
            className={filterCategory === "" || filterCategory === "Karelia" ? "active" : ""}
          >
            AMK ravintolat
          </button>
          <button
            onClick={() => setFilterSpecial(!filterSpecial)}
            className={filterSpecial ? "active" : ""}
          >
            Piilota erikoisannokset
          </button>

          <button
            onClick={() => setFilterDessert(!filterDessert)}
            className={filterDessert ? "active" : ""}
          >
            Piilota jälkiruoat
          </button>
          <button onClick={toggleDarkMode}
            className={isDarkMode ? "active" : ""}>
            Tumma teema
          </button>
        </div>

        <PageSettings
          displayDate={displayDate}
          currentDate={currentDate}
          lastDate={lastDate}
          goToPreviousDay={goToPreviousDay}
          goToNextDay={goToNextDay}
          renderDateLabel={renderDateLabel}
        />
      </div>

      <div className="restaurant-grid-container">
        <div className="restaurant-grid">
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
      <Footer />
      <Analytics />
    </div>
  );
};

export default App;
