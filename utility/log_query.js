const addQueryParams = (query, params) => {
  params.forEach((element, i) => {
    query = query.replace(`$${i + 1}`, element);
  });
  return query;
};

const logQuery = (query, params = null) => {
  const date = new Date();
  const time =
    date.getHours() +
    ":" +
    date.getMinutes() +
    ":" +
    date.getSeconds() +
    "." +
    date.getMilliseconds();
  console.log(
    `${time} - Executed query:\n\n${
      params ? addQueryParams(query, params) : query
    }\n`
  );
};

module.exports = { addQueryParams, logQuery };
