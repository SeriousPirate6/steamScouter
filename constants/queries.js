const properties = require("./properties");

module.exports = Object.freeze({
  // CREATES
  CREATES: new Map([
    [
      properties.CURRENCIES,
      `CREATE TABLE IF NOT EXISTS ${properties.CURRENCIES} (
          id SERIAL NOT NULL,
          from_begin VARCHAR(3) NOT NULL,
          to_end VARCHAR(3) NOT NULL,
          value NUMERIC(10, 2),
          date TIMESTAMP NOT NULL DEFAULT current_timestamp,
        PRIMARY KEY (id, from_begin, to_end)
      );`,
    ],
  ]),

  // INSERT
  INSERTS: new Map([
    [
      properties.CURRENCIES,
      `INSERT INTO ${properties.CURRENCIES}(
          from_begin,
          to_end,
          value
    	) VALUES ($1, $2, $3);`,
    ],
  ]),

  // SELECTS
  SELECTS: new Map([
    [properties.SELECT_ALL, `SELECT * FROM $1`],
    [
      properties.SELECT_EXISTS,
      `SELECT 
    COUNT(table_name)
FROM 
    information_schema.tables 
WHERE 
	table_name = $1;`,
    ],
  ]),

  // DELETES
  DELETES: new Map([
    [
      properties.CURRENCIES,
      `DELETE FROM ${properties.CURRENCIES}
      WHERE $1 = $2;`,
    ],
  ]),

  // DROPS
  DROPS: new Map([[properties.CURRENCIES, `DROP TABLE $1;`]]),
});
