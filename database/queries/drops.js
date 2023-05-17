const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery, addQueryParams } = require("../../utility/log_query");

module.exports = {
  deleteTable: async (table) => {
    const client = await getClient();
    const query = addQueryParams(
      queries.DROPS.get(properties.GENERIC_TABLE),
      table
    );

    try {
      await client.query(query);
      logQuery(query);

      console.log(`Table ${table} dropped`);
    } catch (e) {
      logQuery(query);
      console.log(`Can't drop table ${table}:\n`, e);
    }
    await client.end();
  },
};
