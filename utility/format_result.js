const fs = require("fs");
const juice = require("juice");
const { isJSON } = require("./json_utils");
const parse = require("node-html-parser").parse;

const populateTemplate = ({ table, template, style, attributes, images }) => {
  if (
    (attributes && !Array.isArray(attributes)) ||
    (images && !Array.isArray(images))
  ) {
    console.log("Params 'attributes' and 'images' must be of type array");
    return;
  }

  try {
    const html = fs.readFileSync(template, "utf8");
    const documentStyles = fs.readFileSync(style);

    const root = parse(html);

    if (attributes) {
      attributes.forEach((e) => {
        if (!isJSON(e)) {
          console.log(`Element: ${e} is not a JSON object`);
          return;
        }
        const element = root.getElementById(Object.keys(e)[0]);
        if (element) element.innerHTML = Object.values(e)[0];
      });
    }

    if (images) {
      images.forEach((e) => {
        if (!isJSON(e)) {
          console.log(`Image: ${e} is not a JSON object`);
          return;
        }
        const element = root.getElementById(Object.keys(e)[0]);
        if (element) element.setAttribute("src", Object.values(e)[0]);
      });
    }

    const id_table = root.getElementById(Object.keys({ table })[0]);
    const id_styles = root.getElementById(Object.keys({ style })[0]);

    if (id_table) id_table.innerHTML = table;
    if (id_styles) {
      id_styles.innerHTML = documentStyles;
      if (images) return (root_inline_css = juice(`${root}`));
    }

    return `${root}`;
  } catch (e) {
    console.log(e.stack);
  }
};

module.exports = {
  formatQueryResult: (table, entries) => {
    if (!entries.fields || !entries.rows) {
      console.log("\nIncorrect format for provided param");
      return;
    }

    let t_headers = "",
      t_body = "";

    entries.fields.forEach((e) => {
      t_headers += `<th>${e.name.toUpperCase()}</th>`;
    });

    entries.rows.forEach((e) => {
      t_body += "<tr>";
      Object.values(e).forEach((i) => {
        t_body += `<td>${i}</td>`;
      });
      t_body += "</tr>";
    });

    return populateTemplate({
      template: "templates/select.html",
      style: "templates/css/style.css",
      table,
      attributes: [{ t_headers }, { t_body }],
    });
  },

  formatMailTemplate: (fields, rows, image) => {
    let t_headers = "",
      t_body = "";

    fields.forEach((e) => {
      t_headers += `<th>${e.name.toUpperCase().replace("_", " ")}</th>`;
    });

    rows.forEach((e) => {
      t_body += "<tr>";
      Object.values(e).forEach((i) => {
        t_body += `<td>${i}</td>`;
      });
      t_body += "</tr>";
    });

    return populateTemplate({
      template: "templates/mail.html",
      style: "templates/css/style.css",
      attributes: [{ t_headers }, { t_body }],
      images: [{ image }],
    });
  },
};
