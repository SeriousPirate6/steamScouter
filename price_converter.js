require("dotenv").config();

const axios = require("axios");
const properties = require("./constants/properties");
const currencies = require("./constants/currencies");

const convertCurrency = async (from, to, amount) => {
  try {
    const response = await axios.get(`${properties.CURRENCY_API_URL}/convert`, {
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
  convertToEUR: async (to) => {
    return await convertCurrency(
      Object.keys(currencies).find((e) => e === "EUR"),
      to,
      1
    );
  },
};

module.exports = { price_converter };
