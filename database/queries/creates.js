const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log");

module.exports = {
  createCurrencies: async () => {
    const client = await getClient({ print: true });
    const query = queries.CREATES;
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
