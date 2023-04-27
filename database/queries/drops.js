const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery, addQueryParams } = require("../../utility/log_query");

module.exports = {
  deleteCurrencies: async (table) => {
    const client = await getClient();
    const query = addQueryParams(
      queries.DROPS.get(properties.CURRENCIES),
      table
    );

    try {
      await client.query(query);
      logQuery(query, table);

      console.log(`Table ${table} dropped`);
    } catch (e) {
      logQuery(query, table);
      console.log(`Can't drop table ${table}:\n`, e);
    }
    await client.end();
  },
};
