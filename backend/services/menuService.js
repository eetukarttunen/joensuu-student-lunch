require('dotenv').config();
const axios = require("axios");

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

async function getData() {
  try {
    const promises = Object.entries(restaurantLinks).map(async ([name, link]) => {
      try {
        const response = await axios.get(link);
        const category = (name === "Wire" || name === "Solina") ? "Karelia" : "UEF";

        return { name, data: response.data, category };
      } catch (error) {
        return { name, error: error.message };
      }
    });

    const responses = await Promise.all(promises);
    return responses;
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    throw error;
  }
}

module.exports = {
  getData,
};
