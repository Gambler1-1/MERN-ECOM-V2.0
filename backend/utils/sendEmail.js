const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodemailerConfig');

const sendEmail = async ({ to, subject, html }) => {

  const transporter = nodemailer.createTransport(nodemailerConfig);

  const options = {
    from: "E-COM WEB",
    to: to,
    subject: subject,
    html: html,
  };

  return transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("SENT: " + info.response);
  }); 
};

module.exports = sendEmail;
