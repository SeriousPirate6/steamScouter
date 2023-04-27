const express = require("express");
const bodyParser = require("body-parser");
const { price_converter } = require("./price_converter");
const { steam } = require("./steam");
const inserts = require("./database/queries/inserts");
const { selectAll } = require("./database/queries/selects");
const { formatQueryResult } = require("./utility/format_result");
const properties = require("./constants/properties");
const drops = require("./database/queries/drops");
const { doesTableExists } = require("./utility/check_table");
const creates = require("./database/queries/creates");

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/getPriceConversion", async (req, res) => {
  const to = req.query.to;
  if (!to) {
    res.status(400).send({
      status: "bad request",
      message: "required params: to",
    });
  } else {
    const value = (await price_converter.convertToEUR(to)).data;
    try {
      if (await doesTableExists([properties.CURRENCIES])) {
        await creates.createCurrencies();
      }
      await inserts.insertCurrencies("EUR", to, value.result);
      res.send(value);
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .send({ code: "500", message: "Record uploading in DB failed." });
    }
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

app.get("/getFromRedis", async (req, res) => {
  const table = req.query.table;
  if (!table) {
    res.status(400).send({
      status: "bad request",
      message: "Required params: table",
    });
  } else {
    // if (await doesTableExists([table])) {
    const result = formatQueryResult(table, await selectAll([table]));
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(result);
    // } else {
    //   res.status(400).send({
    //     status: "bad request",
    //     message: "Table require does not exists",
    //   });
    // }
  }
});

// (async () => {
//   await drops.deleteCurrencies([properties.CURRENCIES]);
// })();

app.listen(port, () => console.log(`App listening at ${port}`));
