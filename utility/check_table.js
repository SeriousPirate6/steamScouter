const queries = require("../constants/queries");
const properties = require("../constants/properties");
const { getClient } = require("../database/connection");
const { logQuery, addQueryParams } = require("./log_query");

module.exports = {
  doesTableExists: async (table) => {
    const client = await getClient();
    const query = queries.SELECTS.get(properties.SELECT_EXISTS);
    const params = [table.toLowerCase()];

    try {
      const exist = (await client.query(query, params)).rows[0].exists;
      await client.end();

      logQuery(query, params);
      console.log(`Table ${table} exists: ${exist}`);

      return exist;
    } catch (e) {
      console.log(`Can't execute the query:\n`, e);
      logQuery(query, params);
      return;
    }
  },
};
