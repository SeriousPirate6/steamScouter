const express = require("express");
const bodyParser = require("body-parser");
const { price_converter } = require("./utility/price-converter");

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getPriceConversion", async (req, res) => {
  if (!req.body || !req.body.to || !req.body.from || !req.body.amount) {
    res.status(400).send({
      status: "bad request",
      message: "body required with params: to, from, amount",
    });
  } else {
    const value = (
      await price_converter.convertToEUR(
        req.body.to,
        req.body.from,
        req.body.amount
      )
    ).data;
    res.send(value);
  }
});

app.listen(port, () => console.log(`App listening at ${port}`));
