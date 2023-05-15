const axios = require("axios");
const properties = require("./constants/properties");

const filterData = (response) => {
  const firstVal = Object.keys(response.data)[0]; // taking the first element of the JSON object, whatever it is
  const data = response.data;
  let dataFiltered = {};

  dataFiltered["type"] = data["type"];
  dataFiltered["name"] = data["name"];
  dataFiltered["steam_appid"] = data["steam_appid"];
  dataFiltered["is_free"] = data["is_free"];
  dataFiltered["fullgame"] = data["fullgame"];
  dataFiltered["header_image"] = data["header_image"];
  dataFiltered["website"] = data["website"];
  dataFiltered["price_overview"] = data["price_overview"];

  return { [firstVal]: dataFiltered };
};

const filterMultiData = (response) => {
  const data = response.data;
  let allDataFiltered = {};
  Object.keys(data).forEach((e) => (allDataFiltered[e] = filterData(data[e])));
  return allDataFiltered;
};

const steam = {
  getGameByAppID: async (appids, countryCode) => {
    const appids_list = String(appids).split(",");
    try {
      const response = await axios.get(
        `${properties.STEAM_API_URL}/appdetails`,
        {
          params: {
            appids,
            cc: countryCode.substring(0, 2), // Steam wants only the first two chars of the country-code
            filters:
              appids_list.length > 1
                ? "price_overview"
                : "basic,price_overview",
          },
        }
      );
      return filterMultiData(response);
    } catch (error) {
      return error.response;
    }
  },
};

module.exports = { steam };
