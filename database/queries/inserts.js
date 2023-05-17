const selects = require("./selects");
const { getClient } = require("../connection");
const queries = require("../../constants/queries");
const properties = require("../../constants/properties");
const currencies = require("../../constants/currencies");
const { logQuery, addQueryParams } = require("../../utility/log_query");

module.exports = {
  insertOrUpdateConversions: async (from, to, value) => {
    const client = await getClient();

    const conversion = await selects.selectWhere(properties.CONVERSIONS, {
      [properties.CONVERSIONS_FIELDS.from]: from,
      [properties.CONVERSIONS_FIELDS.to]: to,
    });

    let query, params;

    if (conversion) {
      params = [value, from, to];
      query = addQueryParams(
        queries.UPDATES.get(properties.CONVERSIONS_VALUE),
        params
      );
    } else {
      params = [
        from,
        to,
        currencies[to].currency_name,
        currencies[to].region,
        value,
      ];
      query = addQueryParams(
        queries.INSERTS.get(properties.CONVERSIONS),
        params
      );
    }

    try {
      const insertRow = await client.query(query);
      logQuery(query);

      console.log(`Inserted ${insertRow.rowCount} row`);
    } catch (e) {
      logQuery(query);
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
