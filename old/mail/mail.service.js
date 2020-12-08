const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.IC_MAILSERVER,
  port: 587,
  tls: {
    ciphers:'SSLv3',
    rejectUnauthorized: false
  },
  debug: true,
  auth: {
      user: process.env.IC_MAILUSER,
      pass: process.env.IC_MAILPW
  }
});
let mailOptions = {
    from: process.env.IC_MAILFROM
};

module.exports = {
  sendMail: function (to,subject,text) {
    mailOptions.to = to
    mailOptions.subject = subject
    mailOptions.text = text
    console.log(mailOptions)
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			return console.log(err);
		}
		return console.log('Email sent!!!',data);
	});
  }
}
