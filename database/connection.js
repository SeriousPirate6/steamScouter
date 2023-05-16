const { Client } = require("pg");
const properties = require("../constants/properties");
require("dotenv").config();

module.exports = {
  getClient: async (print = false) => {
    const client = new Client({
      host:
        process.env.ENV === properties.RENDER_ENV
          ? process.env.PG_HOST_RENDER
          : process.env.PG_HOST_LOCAL,
      port: process.env.PG_PORT,
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      ssl: { rejectUnauthorized: false },
    });
    await client.connect();
    const res = await client.query("SELECT $1::text as connected", [
      "Connected to PostgreSQL!\n",
    ]);
    if (print) console.log(res.rows[0].connected);
    return client;
  },
};
