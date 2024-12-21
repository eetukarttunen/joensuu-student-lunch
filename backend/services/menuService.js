require('dotenv').config();
const axios = require("axios");

// Define restaurant names and their API links in an object
const restaurantLinks = {
  Aura: process.env.Aura,
  Carelia: process.env.Carelia,
  Futura: process.env.Futura,
  WickedRabbit: process.env.WickedRabbit,
  Natura: process.env.Natura,
  Bistro: process.env.Bistro,
  Wire: process.env.Wire,
  Solina: process.env.Solina,
};

// Function to get data from all restaurant API links
async function getData() {
  try {
    const promises = Object.entries(restaurantLinks).map(([name, link]) => {
      return axios.get(link)
        .then(response => ({ name, data: response.data }))
        .catch(error => ({ name, error: error.message }));
    });

    const responses = await Promise.all(promises);
    return responses;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getData,
};
