import React, { useState, useEffect } from 'react';
import RestaurantBox from './RestaurantBox';
import './App.css';
import PanLoader from './PanLoader';
import FAQ from './FAQ';
import './SettingsComponent.css';
import Navigation from './Navigation/Navigation';
import { Analytics } from "@vercel/analytics/react"

const apiURL = process.env.REACT_APP_BASE_URL;

const App = () => {
  const [restaurantData, setRestaurantData] = useState([]);
  const currentDate = new Date().toISOString().split('T')[0];
  const [displayDate, setDisplayDate] = useState(currentDate);
  const [lastDate, setLastDate] = useState(currentDate);
  const [isLoading, setIsLoading] = useState(true);
  const initialPinnedRestaurants = JSON.parse(localStorage.getItem('pinnedRestaurants')) || [];
  const [pinnedRestaurants, setPinnedRestaurants] = useState(initialPinnedRestaurants);
  const [isFAQEnabled, setIsFAQEnabled] = useState(false);

  const handleTogglePin = (restaurantName) => {
    const updatedPinnedRestaurants = pinnedRestaurants.includes(restaurantName)
      ? pinnedRestaurants.filter(name => name !== restaurantName)
      : [...pinnedRestaurants, restaurantName];

    setPinnedRestaurants(updatedPinnedRestaurants);
    localStorage.setItem('pinnedRestaurants', JSON.stringify(updatedPinnedRestaurants));
  };
  
  useEffect(() => {
    fetch(apiURL + '/api/menus')
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setRestaurantData(data);
          const dates = data.map((restaurant) => restaurant.data.MenusForDays).flat();
          const lastDateInData = new Date(Math.max(...dates.map((date) => new Date(date.Date))));
          setLastDate(lastDateInData.toISOString().split('T')[0]);
        } else {
          console.error('Invalid data format received:', data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  // Sort the open restaurants alphabetically
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
      return -1; // Move open restaurants to the top
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
    <>
      <div className='App-info'>
        <Navigation />
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
              />
            ))
          )}


        </div>
      </div>
      <div>
      </div>

      {isLoading ? (
        <></>
      ) : (
        <>
          <div className="settings-container">
            <div className="settings-row">
              <span className="settings-label">FAQ</span>
              <label className="form-switch">
              <input type="checkbox" checked={isFAQEnabled} onChange={() => setIsFAQEnabled(!isFAQEnabled)} />
              <i></i>
              </label>
            </div>
          </div>
          {!isFAQEnabled ? (
        <></>
      ) : (
        <>
          <FAQ
            question="Kuinka tallennan suosikkiravintolani?"
            answer={
              <ul>
                <li>1. Etsi sovelluksessa haluamasi ravintola, jonka haluat tallentaa suosikiksi.</li>
                <li>2. Tallenna ravintola klikkaamalla ruokalistan oikeassa yläkulmassa sijaitsevaa harmaata nasta-kuvaketta.</li>
                <li>3. Tallennettu ravintola siirtyy järjestyksessä ensimmäiseksi tai aakkosjärjestyksessä ensimmäisten joukkoon.</li>
                <li>4. Tarvittaessa voit poistaa ravintolan tallennetuista klikkaamalla uudelleen nasta-kuvaketta.</li>
              </ul>
            }
          />

          <FAQ
            question="Miten tallennetut ravintolat säilyvät?"
            answer="Kun olet tallentanut suosikkiravintolasi, ne tallentuvat automaattisesti selaimen paikalliseen säilytysmuistiin. Tämä tarkoittaa, että kun palaat sovellukseen myöhemmin tai suljet ja avaat selaimen, suosikkiravintolasi ovat yhä tallennettuna. Huomaa kuitenkin, että jos käytät eri laitteita tai tyhjennät selaimen välimuistin, saattaa olla tarpeen tallentaa suosikkiravintolat uudelleen."
          />

          <FAQ
            question="Miksi tallentamani ravintola on hävinnyt?"
            answer="Joskus tallentamat ravintolat voivat kadota, jos tyhjennät selaimen välimuistin tai käytät eri laitetta. Tallentamasi tiedot säilyvät paikallisesti selaimessa, joten ne ovat sidoksissa selaimen tilaan. Suosittelemme tallentamaan suosikkiravintolat uudelleen, jos huomaat niiden hävinneen."
          />
        </>
      )}
      </>
      )}
      <br/>
      <footer><a href="https://github.com/eetukarttunen">Copyright © 2024 ietu</a></footer>
      <Analytics />
    </>
  );
};

export default App;
