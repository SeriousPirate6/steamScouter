const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log");

module.exports = {
  deleteCurrencies: async (field, value) => {
    const client = await getClient();
    const query = queries.DELETES.get(properties.CURRENCIES);

    try {
      const entries = await client.query(query, [field, value]);
      logQuery(query);
      console.log(`Database entries: ${entries.rowCount} row(s)`);
    } catch (e) {
      logQuery(query);
      console.log("Can't delete the row(s):\n", e);
    }

    await client.end();
  },
};
