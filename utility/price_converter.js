require("dotenv").config();

const axios = require("axios");
const constants = require("../constants/constants");

const convertCurrency = async (from, to, amount) => {
  try {
    const response = await axios.get(`${constants.CURRENCY_API_URL}/convert`, {
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.CURRENCY_API_KEY,
      },
      params: {
        from,
        to,
        amount,
      },
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

const price_converter = {
  convertToEUR: async (to, amount) => {
    return await convertCurrency(constants.EURO, to, amount);
  },
};

module.exports = { price_converter };
