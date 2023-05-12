const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log_query");

module.exports = {
  deleteConversions: async (field, value) => {
    const client = await getClient();
    const query = queries.DELETES.get(properties.CONVERSIONS);
    const params = [field, value];

    try {
      const entries = await client.query(query, params);
      logQuery(query, params);
      console.log(`Database entries: ${entries.rowCount} row(s)`);
    } catch (e) {
      logQuery(query, params);
      console.log("Can't delete the row(s):\n", e);
    }

    await client.end();
  },
};
