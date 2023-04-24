const express = require("express");
const bodyParser = require("body-parser");
const { price_converter } = require("./utility/price_converter");
const { steam } = require("./utility/steam");

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getPriceConversion", async (req, res) => {
  if (!req.query.to || !req.query.amount) {
    res.status(400).send({
      status: "bad request",
      message: "required params: to, amount",
    });
  } else {
    const value = (
      await price_converter.convertToEUR(req.query.to, req.query.amount)
    ).data;
    res.send(value);
  }
});

app.get("/getGameById", async (req, res) => {
  if (!req.query.appids || !req.query.countryCode) {
    res.status(400).send({
      status: "bad request",
      message: "required params: appids, countryCode",
    });
  } else {
    const value = await steam.getGameByAppID(
      req.query.appids,
      req.query.countryCode
    );
    res.send(value);
  }
});

app.listen(port, () => console.log(`App listening at ${port}`));
