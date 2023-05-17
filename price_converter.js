require("dotenv").config();
const creates = require("./database/queries/creates");
const inserts = require("./database/queries/inserts");
const { doesTableExists } = require("./utility/check_table");

const axios = require("axios");
const properties = require("./constants/properties");
const currencies = require("./constants/currencies");

module.exports = {
  convertCurrency: (convertCurrency = async (from, to, amount) => {
    try {
      const response = await axios.get(
        `${properties.CURRENCY_API_URL}/convert`,
        {
          timeout: properties.DEFAULT_TIMEOUT, // unluckily very slow api endpoint
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.CURRENCY_API_KEY,
          },
          params: {
            from,
            to,
            amount,
          },
        }
      );
      return response;
    } catch (error) {
      return error.response;
    }
  }),

  convertToEUR: (convertToEUR = async (to) => {
    return await convertCurrency(
      Object.keys(currencies).find((e) => e === "EUR"),
      to,
      1
    );
  }),

  insertOrUpdateConversions: async (req, res) => {
    req.setTimeout(properties.DEFAULT_TIMEOUT, function () {
      res.send({ code: "error", message: "Request timeout reached..." });
    });
    const to = req.query.to;
    if (!to) {
      res.status(400).send({
        status: "bad request",
        message: "required params: to",
      });
    } else {
      if (!Object.keys(currencies).find((e) => e === to)) {
        res.status(400).send({
          status: "bad request",
          message: "invalid param: 'to'",
        });
      } else {
        const value = (await convertToEUR(to)).data;
        try {
          if (!(await doesTableExists(properties.CONVERSIONS))) {
            await creates.createConversions();
          }
          await inserts.insertOrUpdateConversions(
            properties.DEFAULT_CURRENCY,
            to,
            value.result
          );
          res.send(value);
        } catch (e) {
          console.log(e);
          res
            .status(500)
            .send({ code: "500", message: "Record uploading in DB failed." });
        }
      }
    }
  },
};
