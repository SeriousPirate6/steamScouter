const selects = require("../database/queries/selects");
const fs = require("fs");

module.exports = {
  formatQueryResult: (table, entries) => {
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

    const documentStyles = fs.readFileSync("css/style.css");

    const result = `
        <!DOCTYPE html>
        <html>
            <style>
                ${documentStyles}
            </style>
            <body>
                <div>
                    <h2>${table}</h2>
                    <table>
                        <tr>
                            ${headers}
                        </tr>
                            ${rows}
                    </table>
                </div>
            </body>
        </html>
    `;

    return result;
  },
};
