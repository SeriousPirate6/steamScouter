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
const selects = require("./database/queries/selects");
const updates = require("./database/queries/updates");
const currencies = require("./constants/currencies");
const { sendMail } = require("./mail/sendmail");

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
    if (!Object.keys(currencies).find((e) => e === to)) {
      res.status(400).send({
        status: "bad request",
        message: "invalid param: 'to'",
      });
    }
    const value = (await price_converter.convertToEUR(to)).data;
    try {
      if (!(await doesTableExists(properties.CONVERSIONS))) {
        await creates.createConversions();
      }
      await inserts.insertConversions(
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
  let table = req.query.table;
  if (!table) {
    res.status(400).send({
      status: "bad request",
      message: "Required params: table",
    });
  } else {
    if (Array.isArray(table)) table = table[0];
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
    const games_added = [];
    const games_id_not_valid = [];
    const games_already_present = [];
    for await (id of game_ids) {
      const game_already_loaded = await selects.gameAlreadyLoaded(id);
      switch (game_already_loaded) {
        case properties.INVALID_GAME_ID:
          games_id_not_valid.push(id);
          continue;
        case true:
          games_already_present.push(id);
          continue;
        default:
          const value = await steam.getGameByAppID(
            id,
            Object.keys(currencies).find((e) => e === "EUR")
          );
          if (!value) {
            games_id_not_valid.push(id);
            continue;
          }

          const game = value[id].type;
          await inserts.insertGames(
            game.type,
            game.name,
            id,
            game.is_free,
            game.fullgame ? game.fullgame.appid : null,
            game.header_image,
            game.price_overview ? game.price_overview.initial : 0,
            game.price_overview ? game.price_overview.final : 0
          );
          games_added.push(id);
      }
    }
    res.send({
      code: "success",
      message: { games_added, games_already_present, games_id_not_valid },
    });
  }
});

app.get("/checkGamePrice", async ({ res }) => {
  const games = (await selects.selectAll([properties.GAMES])).rows;
  const conversions = await selects.selectLastCurrencyValue([
    currencies[properties.DEFAULT_CURRENCY].code,
  ]);
  const prices_list = [];
  for await (g of games) {
    if (g.is_free) continue;
    let body_string = `${g.name}\n`;
    const price_per_game = [];
    const id = g.game_id;
    await updates.updateGamesPrices(id);
    for await (conv of conversions) {
      const value = await steam.getGameByAppID(
        id,
        conv[properties.CONVERSIONS_FIELDS.to]
      );
      const price = value[id].type.price_overview;
      if (!price) continue;
      if (price.final === price.initial) continue;

      const price_converted = (
        price.final /
        conv[properties.CONVERSIONS_FIELDS.value] /
        100
      ).toFixed(2);

      body_string += `\n${
        conv[properties.CONVERSIONS_FIELDS.to]
      }: ${price_converted} ${properties.DEFAULT_CURRENCY}`;

      price_per_game.push({
        currency: conv[properties.CONVERSIONS_FIELDS.to],
        price_converted,
      });
    }
    if (price_per_game.length > 0) {
      prices_list.push({
        id,
        name: g.name,
        change_in_price: price_per_game,
      });
      await sendMail(
        `STEAM - PRICE CHANGE: ${g.name}`,
        body_string,
        process.env.EMAIL_TO
      );
    }
  }
  res.send({
    code: "success",
    message: prices_list.length > 0 ? prices_list : "no changes detected",
  });
});

(async () => {
  // await drops.deleteTable([properties.GAMES]);
})();

app.listen(port, () => console.log(`App listening at ${port}`));
