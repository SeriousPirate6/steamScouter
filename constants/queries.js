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
      // Add game name ASAP
      `CREATE TABLE IF NOT EXISTS ${properties.GAMES} (
          id SERIAL NOT NULL,
          type VARCHAR(20) NOT NULL,
          name VARCHAR(200) NOT NULL,
          game_id INTEGER NOT NULL,
          is_free BOOLEAN NOT NULL,
          fullgame_id INTEGER,
          header_image VARCHAR(200) NOT NULL,
          eur_price INTEGER,
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
          type, name, game_id, is_free, fullgame_id, header_image, eur_price
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7
      );`,
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
    [properties.SELECT_WHERE, `SELECT * FROM $1 WHERE $2 = $3;`],
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
