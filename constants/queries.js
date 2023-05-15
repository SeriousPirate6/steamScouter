const properties = require("./properties");

module.exports = Object.freeze({
  // CREATES
  CREATES: new Map([
    [
      properties.CONVERSIONS,
      `CREATE TABLE IF NOT EXISTS ${properties.CONVERSIONS} (
          ${properties.DEFAULT_FIELDS.id} SERIAL NOT NULL,
          ${properties.CONVERSIONS_FIELDS.from} VARCHAR(3) NOT NULL,
          ${properties.CONVERSIONS_FIELDS.to} VARCHAR(3) NOT NULL,
          ${properties.CONVERSIONS_FIELDS.to_fullname} VARCHAR(50) NOT NULL,
          ${properties.CONVERSIONS_FIELDS.to_region} VARCHAR(50) NOT NULL,
          ${properties.CONVERSIONS_FIELDS.value} NUMERIC(10, 2),
          ${properties.DEFAULT_FIELDS.date} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (
            ${properties.DEFAULT_FIELDS.id},
            ${properties.CONVERSIONS_FIELDS.from},
            ${properties.CONVERSIONS_FIELDS.to}
          )
      );`,
    ],
    [
      properties.GAMES,
      // Add game name ASAP
      `CREATE TABLE IF NOT EXISTS ${properties.GAMES} (
          ${properties.DEFAULT_FIELDS.id} SERIAL NOT NULL,
          ${properties.GAMES_FIELDS.type} VARCHAR(20) NOT NULL,
          ${properties.GAMES_FIELDS.game_name} VARCHAR(200) NOT NULL,
          ${properties.GAMES_FIELDS.game_id} INTEGER NOT NULL,
          ${properties.GAMES_FIELDS.is_free} BOOLEAN NOT NULL,
          ${properties.GAMES_FIELDS.fullgame_id} INTEGER,
          ${properties.GAMES_FIELDS.header_image} VARCHAR(200) NOT NULL,
          ${properties.GAMES_FIELDS.eur_price.initial} INTEGER,
          ${properties.GAMES_FIELDS.eur_price.final} INTEGER,
          ${properties.DEFAULT_FIELDS.date} TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (${properties.GAMES_FIELDS.game_id})
      );`,
    ],
  ]),

  // INSERT
  INSERTS: new Map([
    [
      properties.CONVERSIONS,
      `INSERT INTO ${properties.CONVERSIONS} (
          ${properties.CONVERSIONS_FIELDS.from},
          ${properties.CONVERSIONS_FIELDS.to},
          ${properties.CONVERSIONS_FIELDS.to_fullname},
          ${properties.CONVERSIONS_FIELDS.to_region},
          ${properties.CONVERSIONS_FIELDS.value}
    	) VALUES ($1, $2, $3, $4, $5);`,
    ],
    [
      properties.GAMES,
      `INSERT INTO ${properties.GAMES} (
          ${properties.GAMES_FIELDS.type},
          ${properties.GAMES_FIELDS.game_name},
          ${properties.GAMES_FIELDS.game_id},
          ${properties.GAMES_FIELDS.is_free},
          ${properties.GAMES_FIELDS.fullgame_id},
          ${properties.GAMES_FIELDS.header_image},
          ${properties.GAMES_FIELDS.eur_price.initial},
          ${properties.GAMES_FIELDS.eur_price.final}
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8
      );`,
    ],
  ]),

  // UPDATES
  UPDATES: new Map([
    [
      properties.UPDATE_PRICES,
      `UPDATE ${properties.GAMES}
      SET (
        ${properties.GAMES_FIELDS.eur_price.final},
        ${properties.DEFAULT_FIELDS.date}
      ) = (
        $1, CURRENT_TIMESTAMP
      )
      WHERE ${properties.GAMES_FIELDS.game_id} = $2`,
    ],
  ]),

  // SELECTS
  SELECTS: (selects = new Map([
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
      `SELECT
          ${properties.CONVERSIONS_FIELDS.to},
          ${properties.CONVERSIONS_FIELDS.value}
          FROM (
            SELECT DISTINCT
              ${properties.CONVERSIONS_FIELDS.from},
              ${properties.CONVERSIONS_FIELDS.to},
              ${properties.CONVERSIONS_FIELDS.value},
              ${properties.DEFAULT_FIELDS.date}
            FROM ${properties.CONVERSIONS}
            ORDER BY ${properties.DEFAULT_FIELDS.date} DESC
          ) AS CURRENCIES_TO
          WHERE ${properties.CONVERSIONS_FIELDS.from} = $1`,
    ],
    [properties.SELECT_WHERE, `SELECT * FROM $1 WHERE $2 = $3;`],
  ])),

  // DELETES
  DELETES: new Map([
    [
      properties.CONVERSIONS,
      `DELETE FROM ${properties.CONVERSIONS}
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
