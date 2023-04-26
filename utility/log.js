module.exports = {
  logQuery: (query) => {
    const date = new Date();
    const time =
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds() +
      "." +
      date.getMilliseconds();
    console.log(`${time} - Executed query:\n\n${query}\n`);
  },
};
