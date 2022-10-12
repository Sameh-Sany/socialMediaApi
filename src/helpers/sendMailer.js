const nodemailer = require("nodemailer");

const sendMailer = async (email, body) => {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "testmailejjadh@gmail.com", // generated ethereal user
      pass: "L=B.?U_qUQ$d", // generated ethereal password
    },
  });
  // send mail with defined transport object
  let info = await transporter.sendMail({
    to: email, // list of receivers
    subject: body.subject, // Subject line
    text: body.text, // plain text body
    html: body.html, // html body
  });
  console.log("Message sent", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  // Preview only available when sending through an Ethereal account
  console.log("Preview URL", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};
exports.sendMailer = sendMailer;
