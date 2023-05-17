const { steam } = require("../../steam");
const { getClient } = require("../connection");
const queries = require("../../constants/queries");
const properties = require("../../constants/properties");
const currencies = require("../../constants/currencies");
const { logQuery, addQueryParams } = require("../../utility/log_query");

module.exports = {
  updateGamesPrices: async (game_id) => {
    const value = await steam.getGameByAppID(
      game_id,
      Object.keys(currencies).find((e) => e === properties.DEFAULT_CURRENCY)
    );
    if (!value[game_id].type.price_overview) {
      console.log(`No price found for game_id: ${game_id}`);
      return;
    }
    const eur_price_final = value[game_id].type.price_overview.final;
    const params = [eur_price_final, game_id];

    const client = await getClient();
    const query = addQueryParams(
      queries.UPDATES.get(properties.GAMES_PRICES),
      params
    );

    try {
      const entries = await client.query(query);
      logQuery(query);

      console.log(`Database updated: ${entries.rowCount} row(s)`);

      await client.end();

      return entries;
    } catch (e) {
      logQuery(query);
      console.log("Can't execute the query:\n", e);
      return;
    }
  },
  updateGamesStatus: async (game_id, been_watched) => {
    const params = [game_id, been_watched];

    const client = await getClient();
    const query = addQueryParams(
      queries.UPDATES.get(properties.GAMES_STATUS),
      params
    );

    try {
      const entries = await client.query(query);
      logQuery(query);

      console.log(`Database updated: ${entries.rowCount} row(s)`);

      await client.end();

      return entries;
    } catch (e) {
      logQuery(query);
      console.log("Can't execute the query:\n", e);
      return;
    }
  },
};
