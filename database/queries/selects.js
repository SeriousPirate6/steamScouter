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
      console.log("Can't insert the row:\n", e);
      return;
    }
  },
};
