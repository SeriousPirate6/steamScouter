const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log_query");
const properties = require("../../constants/properties");

module.exports = {
  createCurrencies: async () => {
    const client = await getClient({ print: true });
    const query = queries.CREATES.get(properties.CURRENCIES);
    try {
      const res = await client.query(query);
      logQuery(query);
    } catch (e) {
      logQuery(query);
      console.log("Impossible to create the table: \n", e);
    }
    await client.end();
  },
};
