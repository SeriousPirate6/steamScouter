const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery, addQueryParams } = require("../../utility/log_query");

module.exports = {
  selectAll: async (params) => {
    const client = await getClient();
    const query = addQueryParams(
      queries.SELECTS.get(properties.SELECT_ALL),
      params
    );

    try {
      const entries = await client.query(query);
      logQuery(query, params);

      console.log(`Database entries: ${entries.rowCount} row(s)`);

      await client.end();

      return entries;
    } catch (e) {
      logQuery(query, params);
      console.log("Can't execute the query:\n", e);
      return;
    }
  },

  selectLastCurrencyValue: async (params) => {
    const client = await getClient();
    const query = queries.SELECTS.get(properties.SELECT_LASTEST_CUR_VAL);

    try {
      const entries = await client.query(query, params);
      logQuery(query, params);

      console.log(`Database entries: ${entries.rowCount} row(s)`);

      await client.end();

      if (!entries.rows[0]) return null;
      return Object.values(entries.rows);
    } catch (e) {
      logQuery(query, params);
      console.log("Can't execute the query:\n", e);
      return;
    }
  },

  selectWhere: (selectWhere = async (params) => {
    const client = await getClient();
    const query = addQueryParams(
      queries.SELECTS.get(properties.SELECT_WHERE),
      params
    );

    try {
      const entries = await client.query(query);
      logQuery(query, params);

      console.log(`Database entries: ${entries.rowCount} row(s)`);

      await client.end();

      return entries.rows[0];
    } catch (e) {
      logQuery(query, params);
      console.log("Can't execute the query:\n", e);
      return;
    }
  }),

  gameAlreadyLoaded: async (game_id) => {
    if (!Number.isInteger(game_id)) {
      console.log("Invalid value for param 'game_id'");
      return properties.INVALID_GAME_ID;
    }
    const games = await selectWhere([properties.GAMES, "game_id", game_id]);
    if (games) return true;
    return false;
  },
};
