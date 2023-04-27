const queries = require("../constants/queries");
const properties = require("../constants/properties");
const { getClient } = require("../database/connection");
const { logQuery, addQueryParams } = require("./log_query");

module.exports = {
  doesTableExists: async (table) => {
    const client = await getClient();
    const query = queries.SELECTS.get(properties.SELECT_EXISTS);

    try {
      const result = await client.query(query, table);
      const exist = result.rows[0].exists;
      logQuery(query, table);
      await client.end();

      console.log(`Table ${table} exists: ${exist}`);

      return exist;
    } catch (e) {
      console.log(`Can't execute the query:\n`, e);
      logQuery(query, table);
      return;
    }
  },
};
