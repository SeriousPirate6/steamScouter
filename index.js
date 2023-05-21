const express = require("express");
const { steam } = require("./steam");
const bodyParser = require("body-parser");
const { sendMail } = require("./mail/sendmail");
const drops = require("./database/queries/drops");
const currencies = require("./constants/currencies");
const properties = require("./constants/properties");
const inserts = require("./database/queries/inserts");
const creates = require("./database/queries/creates");
const selects = require("./database/queries/selects");
const updates = require("./database/queries/updates");
const { selectAll } = require("./database/queries/selects");
const { doesTableExists } = require("./utility/check_table");
const {
  formatQueryResult,
  formatMailTemplate,
} = require("./utility/format_result");
const {
  addCurrencyValue,
  insertOrUpdateConversions,
} = require("./price_converter");

const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post(
  "/addCurrencyValue",
  async (req, res) => await addCurrencyValue(req, res)
);

app.get("/updateCurrencyValues", async ({ res }) => {
  const currencies = (await selects.selectAll([properties.CONVERSIONS])).rows;
  const conversions = [];
  for await (curr of currencies) {
    if (
      await insertOrUpdateConversions(
        curr[properties.CONVERSIONS_FIELDS.to],
        curr[properties.CONVERSIONS_FIELDS.value]
      )
    ) {
      conversions.push({
        from: curr[properties.CONVERSIONS_FIELDS.from],
        to: curr[properties.CONVERSIONS_FIELDS.to],
        value: curr[properties.CONVERSIONS_FIELDS.value],
      });
    }
  }
  res.send({
    code: "success",
    message: { conversions_count: currencies.length, conversions },
  });
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
      const selectResult = await selectAll([table]);
      const result = await formatQueryResult(table, selectResult);
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
          games_added.push({
            id,
            name: game.name,
            type: game.type,
            current_price: game.price_overview
              ? game.price_overview.final / 100
              : null,
          });
      }
    }
    res.send({
      code: "success",
      message: { games_added, games_already_present, games_id_not_valid },
    });
  }
});

app.patch("/changeMonitoringStatus", async (req, res) => {
  const game_ids = req.body.game_ids;
  if (!game_ids && !Array.isArray(game_ids)) {
    res.status(400).send({
      status: "bad request",
      message: "Required array param: game_id",
    });
  } else {
    if (!(await doesTableExists(properties.GAMES))) {
      res.status(400).send({
        status: "bad request",
        message: `Table '${properties.GAMES}' does not exists.\nIt is not possible to change monitoring status for the required games`,
      });
    }
    const games_updated = [];
    const games_id_not_valid = [];
    const games_not_present = [];

    for await (id of game_ids) {
      const game_already_loaded = await selects.gameAlreadyLoaded(id);
      switch (game_already_loaded) {
        case properties.INVALID_GAME_ID:
          games_id_not_valid.push(id);
          continue;
        case false:
          games_not_present.push(id);
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

          const monitoring_status =
            game_already_loaded[properties.GAMES_FIELDS.been_watched] === true
              ? false
              : true;

          await updates.updateGamesStatus(id, monitoring_status);
          games_updated.push({
            id,
            name: game_already_loaded[properties.GAMES_FIELDS.game_name],
            monitoring_status,
          });
      }
    }
    res.send({
      code: "success",
      message: { games_updated, games_not_present, games_id_not_valid },
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
    if (!g[properties.GAMES_FIELDS.been_watched]) continue;
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
      const fields = Object.keys(price_per_game[0]).map((e) => {
        // think i'm going mad tinkering with this one
        if (e === Object.keys(prices_list[0].change_in_price[0])[1])
          return JSON.parse(
            JSON.stringify({ name: `${e} (${properties.DEFAULT_CURRENCY})` })
          );
        return JSON.parse(JSON.stringify({ name: e }));
      });
      const formatted_mail_body = formatMailTemplate(
        fields,
        price_per_game,
        g.header_image
      );

      await sendMail(
        `STEAM - PRICE CHANGE: ${g.name}`,
        formatted_mail_body,
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
  // await drops.deleteTable([properties.CONVERSIONS]);
})();

app.listen(port, () => console.log(`App listening at ${port}`));
