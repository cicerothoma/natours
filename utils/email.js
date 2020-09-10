const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transpoter
  const transporter = nodemailer.createTransport({
    // (GMAIL OPTIONS BELOW)
    // service: 'Gmail',
    // auth: {
    //   user: process.env.GMAIL_USERNAME,
    //   pass: process.env.GMAIL_PASSWORD,
    // },
    // Using Gmail, Activate the "less secure app" option

    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Thomas Collins <thomascollins582@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
