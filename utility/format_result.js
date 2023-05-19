const fs = require("fs");
const parse = require("node-html-parser").parse;

module.exports = {
  formatQueryResult: ({ table = null, entries, image = null }) => {
    if (!entries.fields || !entries.rows) {
      console.log("\nIncorrect format for provided param");
      return;
    }

    let headers = "",
      rows = "";

    entries.fields.forEach((e) => {
      headers += `<th>${e.name.toUpperCase()}</th>`;
    });

    entries.rows.forEach((e) => {
      rows += "<tr>";
      Object.values(e).forEach((i) => {
        rows += `<td>${i}</td>`;
      });
      rows += "</tr>";
    });

    // TODO extract a method and declare a function for each template
    const html = fs.readFileSync("templates/mail.html", "utf8");
    const documentStyles = fs.readFileSync("templates/css/style.css");

    const root = parse(html);

    const id_table = root.getElementById("table"),
      id_headers = root.getElementById("headers"),
      id_rows = root.getElementById("rows"),
      id_styles = root.getElementById("styles"),
      id_image = root.getElementById("header_image");

    if (id_table && table) root.getElementById("table").innerHTML = table;
    if (id_headers) root.getElementById("headers").innerHTML = headers;
    if (id_rows) root.getElementById("rows").innerHTML = rows;
    if (id_styles) root.getElementById("styles").innerHTML = documentStyles;
    if (id_image && image)
      root.getElementById("header_image").src =
        "https://cdn.akamai.steamstatic.com/steam/apps/1259420/header_alt_assets_2.jpg?t=1684177712";

    return `${root}`;
  },
};
