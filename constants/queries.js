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
            ${properties.CONVERSIONS_FIELDS.from},
            ${properties.CONVERSIONS_FIELDS.to}
          )
      );`,
    ],
    [
      properties.GAMES,
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
          ${properties.GAMES_FIELDS.been_watched} BOOLEAN NOT NULL DEFAULT TRUE,
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
    	) VALUES (
        '$1', '$2', '$3', '$4', $5
        ) ON CONFLICT DO NOTHING;`,
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
      ) ON CONFLICT DO NOTHING;`,
    ],
  ]),

  // UPDATES
  UPDATES: new Map([
    [
      properties.GAMES_PRICES,
      `UPDATE ${properties.GAMES}
        SET (
          ${properties.GAMES_FIELDS.eur_price.final},
          ${properties.DEFAULT_FIELDS.date}
        ) = (
          $1, CURRENT_TIMESTAMP
        )
        WHERE ${properties.GAMES_FIELDS.game_id} = $2`,
    ],
    [
      properties.GAMES_STATUS,
      `UPDATE ${properties.GAMES}
        SET ${properties.GAMES_FIELDS.been_watched} = $1
        WHERE ${properties.GAMES_FIELDS.game_id} = $2`,
    ],
    [
      properties.CONVERSIONS_VALUE,
      `UPDATE ${properties.CONVERSIONS}
        SET (
          ${properties.CONVERSIONS_FIELDS.value},
          ${properties.DEFAULT_FIELDS.date}
        ) = (
          $1, CURRENT_TIMESTAMP
        )
        WHERE ${properties.CONVERSIONS_FIELDS.from} = '$2'
          AND ${properties.CONVERSIONS_FIELDS.to} = '$3'`,
    ],
  ]),

  // SELECTS
  SELECTS: (selects = new Map([
    [properties.ALL, `SELECT * FROM $1`],
    [
      properties.IF_EXISTS,
      `SELECT EXISTS (
          SELECT FROM pg_tables
          WHERE schemaname = 'public'
            AND tablename  = $1
      );`,
    ],
    [
      properties.LASTEST_CUR_VAL,
      `SELECT DISTINCT
          ${properties.CONVERSIONS_FIELDS.to},
          ${properties.CONVERSIONS_FIELDS.value}
          FROM ${properties.CONVERSIONS}
          WHERE ${properties.CONVERSIONS_FIELDS.from} = $1`,
    ],
    [properties.WHERE, `SELECT * FROM $1 WHERE $2;`],
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
  DROPS: new Map([[properties.GENERIC_TABLE, `DROP TABLE IF EXISTS $1;`]]),
});
