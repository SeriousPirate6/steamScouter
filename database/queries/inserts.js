const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log_query");

module.exports = {
  insertCurrencies: async (from_begin, to_end, value) => {
    const client = await getClient();
    const query = queries.INSERTS.get(properties.CURRENCIES);
    const params = [from_begin, to_end, value];

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
