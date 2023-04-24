const json_utils = {
  isJSON: (input) => {
    try {
      JSON.parse(input);
    } catch (e) {
      return false;
    }
    return true;
  },
};

module.exports = { json_utils };
