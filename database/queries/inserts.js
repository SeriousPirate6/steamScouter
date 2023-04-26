const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log");

module.exports = {
  insertCurrencies: async (from_begin, to_end, value) => {
    const client = await getClient();
    const query = queries.INSERTS.get(properties.CURRENCIES);
    try {
      const insertRow = await client.query(query, [from_begin, to_end, value]);
      logQuery(query);

      console.log(`Inserted ${insertRow.rowCount} row`);
    } catch (e) {
      logQuery(query);
      console.log("Can't insert the row:\n", e);
    }
    await client.end();
  },
};
