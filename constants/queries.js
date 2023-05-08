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
    [
      properties.GAMES,
      `CREATE TABLE IF NOT EXISTS ${properties.GAMES} (
          id SERIAL NOT NULL,
          game_id INTEGER NOT NULL,
          eur_price NUMERIC(10, 2),
          date TIMESTAMP NOT NULL DEFAULT current_timestamp,
        PRIMARY KEY (game_id)
      );`,
    ],
  ]),

  // INSERT
  INSERTS: new Map([
    [
      properties.CURRENCIES,
      `INSERT INTO ${properties.CURRENCIES} (
          from_begin,
          to_end,
          value
    	) VALUES ($1, $2, $3);`,
    ],
    [
      properties.GAMES,
      `INSERT INTO ${properties.GAMES} (
          game_id,
          eur_price
    	) VALUES ($1, $2);`,
    ],
  ]),

  // SELECTS
  SELECTS: new Map([
    [properties.SELECT_ALL, `SELECT * FROM $1`],
    [
      properties.SELECT_EXISTS,
      `SELECT EXISTS (
          SELECT FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename  = $1
      );`,
    ],
    [
      properties.SELECT_LASTEST_CUR_VAL,
      `SELECT value FROM ${properties.CURRENCIES}
          WHERE from_begin = $1
          AND to_end = $2
          ORDER BY date DESC
          LIMIT 1;`,
    ],
  ]),

  // DELETES
  DELETES: new Map([
    [
      properties.CURRENCIES,
      `DELETE FROM ${properties.CURRENCIES}
          WHERE $1 = $2;`,
    ],
    [
      properties.GAMES,
      `DELETE FROM ${properties.GAMES}
          WHERE $1 = $2;`,
    ],
  ]),

  // DROPS
  DROPS: new Map([[properties.DROP_TABLE, `DROP TABLE $1;`]]),
});
