const properties = require("../../constants/properties");
const queries = require("../../constants/queries");
const { getClient } = require("../connection");
const { logQuery } = require("../../utility/log");

module.exports = {
  selectCurrencies: async () => {
    const client = await getClient();
    const query = queries.SELECTS.get(properties.CURRENCIES);

    try {
      const entries = await client.query(query);
      logQuery(query);
      console.log(`Database entries: ${entries.rowCount} row(s)`);
      console.log(Object.keys(entries.rows?.[0]).join("\t"));
      console.log(
        `${entries.rows.map((r) => Object.values(r).join("\t")).join("\n")}`
      );
    } catch (e) {
      logQuery(query);
      console.log("Can't insert the row:\n", e);
    }

    await client.end();
  },
};
