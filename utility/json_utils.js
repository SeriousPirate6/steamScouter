module.exports = {
  isJSON: (isJSON = (input) => {
    try {
      JSON.parse(JSON.stringify(input));
    } catch (e) {
      return false;
    }
    return true;
  }),

  varToString: (varObj) => {
    Object.keys(varObj)[0];
  },

  currencyName(currency) {
    Object.keys(currencies).find((e) => e === currency);
  },
};
