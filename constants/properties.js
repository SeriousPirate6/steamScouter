module.exports = Object.freeze({
  // APIs URL
  STEAM_API_URL: "http://store.steampowered.com/api",
  CURRENCY_API_URL: "https://api.apilayer.com/exchangerates_data",

  // ENVIRONMENTS
  LOCAL_ENV: "LOCAL",
  RENDER_ENV: "RENDER",

  // DEFAULT CONVERSION
  DEFAULT_CURRENCY: "EUR",

  // DEFAULT REQUEST TIMEOUT
  DEFAULT_TIMEOUT: 120000,

  // TABLES TYPES
  ALL: "ALL",
  GENERIC_TABLE: "GENERIC_TABLE",
  SELECT_FROM: "SELECT_FROM",
  WHERE: "WHERE",
  CREATE_TABLE: "CREATE_TABLE",
  INSERT_TABLE: "INSERT_TABLE",
  IF_EXISTS: "IF_EXISTS",
  CONVERSIONS_VALUE: "CONVERSIONS_VALUE",
  GAMES_PRICES: "UPDATE_GAME_PRICES",
  GAMES_STATUS: "GAMES_STATUS",
  SELECT_CURRENCIES_TO: "SELECT_CURRENCIES_TO",
  LASTEST_CUR_VAL: "LASTEST_CUR_VAL",

  // TABLES
  CONVERSIONS: "CONVERSIONS",
  GAMES: "GAMES",

  // DEFAULT_FIELDS
  DEFAULT_FIELDS: {
    id: "id",
    date: "date",
  },

  // TABLE FIELDS
  CONVERSIONS_FIELDS: {
    from: "from_begin",
    to: "to_end",
    to_fullname: "to_fullname",
    to_region: "to_region",
    value: "value",
  },
  GAMES_FIELDS: {
    type: "type",
    game_name: "name",
    game_id: "game_id",
    is_free: "is_free",
    fullgame_id: "fullgame_id",
    header_image: "header_image",
    eur_price: {
      initial: "eur_price_initial",
      final: "eur_price_final",
    },
    been_watched: "been_watched",
  },

  // MESSAGES
  INVALID_GAME_ID: "GAME ID NOT VALID",
});
