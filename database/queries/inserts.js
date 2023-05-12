const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log_query");
const currencies = require("../../constants/currencies").default;

module.exports = {
  insertConversions: async (from_begin, to, value) => {
    const client = await getClient();
    const query = queries.INSERTS.get(properties.CONVERSIONS);
    const params = [
      from_begin,
      to,
      currencies[to].currency_name,
      currencies[to].region,
      value,
    ];

    try {
      const insertRow = await client.query(query, params);
      logQuery(query, params);

      console.log(`Inserted ${insertRow.rowCount} row`);
    } catch (e) {
      logQuery(query, params);
      console.log("Can't insert the row:\n", e);
    }
    await client.end();
  },

  insertGames: async (
    type,
    name,
    game_id,
    is_free,
    fullgame_id,
    image_header,
    eur_price_initial,
    eur_price_final
  ) => {
    const client = await getClient();
    const query = queries.INSERTS.get(properties.GAMES);
    const params = [
      type,
      name,
      game_id,
      is_free,
      fullgame_id,
      image_header,
      eur_price_initial,
      eur_price_final,
    ];

    try {
      const insertRow = await client.query(query, params);
      logQuery(query, params);

      console.log(`Inserted ${insertRow.rowCount} row`);
    } catch (e) {
      logQuery(query, params);
      console.log("Can't insert the row:\n", e);
    }
    await client.end();
  },
};
