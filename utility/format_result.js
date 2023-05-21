const fs = require("fs");
const juice = require("juice");
const parse = require("node-html-parser").parse;

const populateTemplate = ({ template, style, attributes, images }) => {
  // TODO handle control if objs are JSONs
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

    attributes.forEach((e) => {
      const element = root.getElementById(Object.keys(e)[0]);
      if (element) element.innerHTML = Object.values(e)[0];
    });

    images.forEach((e) => {
      const element = root.getElementById(Object.keys(e)[0]);
      if (element) element.setAttribute("src", Object.values(e)[0]);
    });

    const id_styles = root.getElementById(Object.keys({ style })[0]);

    if (id_styles) {
      id_styles.innerHTML = documentStyles;
      return (root_inline_css = juice(`${root}`));
    }

    return `${root}`;
  } catch (e) {
    console.log(e.stack);
  }
};

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

    return populateTemplate({
      template: "templates/mail.html",
      style: "templates/css/style.css",
      attributes: [{ headers }, { rows }],
      images: [{ image }],
    });
  },
};
