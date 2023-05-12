const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery, addQueryParams } = require("../../utility/log_query");
const selects = require("./selects");
const currencies = require("../../constants/currencies").default;

module.exports = {
  updateGamesPrices: async (game_id) => {
    const value = await steam.getGameByAppID(
      `${game_id}`,
      Object.keys(currencies).find((e) => e === "EUR")
    );
    if (!value[id].type.price_overview) {
      console.log(`No price found for game_id: ${game_id}`);
      return;
    }
    const eur_price_final = value[id].type.price_overview.final;
    const params = [eur_price_final, game_id];

    const client = await getClient();
    const query = addQueryParams(
      queries.UPDATES.get(properties.UPDATE_PRICES),
      params
    );

    try {
      const entries = await client.query(query);
      logQuery(query, params);

      console.log(`Database updated: ${entries.rowCount} row(s)`);

      await client.end();

      return entries;
    } catch (e) {
      logQuery(query, params);
      console.log("Can't execute the query:\n", e);
      return;
    }
  },
};
