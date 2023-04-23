require("dotenv").config();

const axios = require("axios");
const constants = require("../constants/constants");

const price_converter = {
  convertToEUR: async (from, to, amount) => {
    const response = await axios.get(`${constants.CURRENCY_API_URL}/convert`, {
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.CURRENCY_API_URL,
      },
      params: {
        from,
        to,
        amount,
      },
    });
    return response;
  },
};

module.exports = { price_converter };
