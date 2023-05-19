require("dotenv").config();
const nodemailer = require("nodemailer");

module.exports = {
  sendMail: async (subject, html, to) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_SERVER,
      port: Number(process.env.PORT),
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html: html,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log(`\nMail sent: ${subject}, ${info.response}\n`);
      }
    });
  },
};
