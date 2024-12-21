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
    // Send a GET request to each API link and store the responses in an array
    const promises = Object.entries(restaurantLinks).map(([name, link]) => {
      return axios.get(link)
        .then(response => ({ name, data: response.data }))
        .catch(error => ({ name, error: error.message })); // Catch errors and include them in the response
    });

    // Wait for all responses to come back
    const responses = await Promise.all(promises);

    // Return the data for each restaurant as an array of objects
    return responses;
  } catch (error) {
    // Throw an error if something goes wrong
    throw error;
  }
}

// Export the getData function
module.exports = {
  getData,
};
