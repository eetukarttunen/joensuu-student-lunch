import React from 'react';
import RestaurantBox from './RestaurantBox';

const RestaurantList = ({
  restaurantData,
  displayDate,
  onTogglePin,
  filterSpecial,
  filterDessert,
}) => (
  <>
    {restaurantData.map((restaurant, index) => (
      <RestaurantBox
        key={index}
        name={restaurant.name}
        data={restaurant.data}
        error={restaurant.error}
        currentDate={displayDate}
        onTogglePin={onTogglePin}
        filterSpecial={filterSpecial}
        filterDessert={filterDessert}
      />
    ))}
  </>
);

export default RestaurantList;
