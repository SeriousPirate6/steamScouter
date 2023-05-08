const express = require("express");
const { steam } = require("./steam");
const bodyParser = require("body-parser");
const drops = require("./database/queries/drops");
const properties = require("./constants/properties");
const inserts = require("./database/queries/inserts");
const creates = require("./database/queries/creates");
const { price_converter } = require("./price_converter");
const { selectAll } = require("./database/queries/selects");
const { formatQueryResult } = require("./utility/format_result");
const { doesTableExists } = require("./utility/check_table");

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
      if (await doesTableExists(properties.CURRENCIES)) {
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
    if (await doesTableExists(table)) {
      const result = formatQueryResult(table, await selectAll([table]));
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(result);
    } else {
      res.status(400).send({
        status: "bad request",
        message: "The table required does not exists",
      });
    }
  }
});

app.post("/addGameMonitoring", async (req, res) => {
  const game_ids = req.body.game_ids;
  if (!game_ids && !Array.isArray(game_ids)) {
    res.status(400).send({
      status: "bad request",
      message: "Required array param: game_id",
    });
  } else {
    if (!(await doesTableExists(properties.GAMES))) {
      await creates.createGames();
    }
    for await (id of game_ids) {
      const value = await steam.getGameByAppID(`${id}`, properties.CURRENCIES);
      price = value[id].type.price_overview;
      await inserts.insertGames(id, price ? price.final : 0);
    }
    res.send({
      code: "success",
      message: `added monitoring function for ${game_ids} ids`,
    });
  }
});

app.get("/checkGamePrice", async () => {});

(async () => {
  await drops.deleteTable([properties.GAMES]);
})();

app.listen(port, () => console.log(`App listening at ${port}`));
