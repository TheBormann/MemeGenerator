require("dotenv").config();
const nodemailer = require("nodemailer");

async function sendPasswordResetEmail(userEmail, resetToken) {
  console.log({
    host: process.env.EMAIL_HOST, // Replace with your mail server host
    port: process.env.EMAIL_PORT,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_AUTH_USER, // your SMTP username
      pass: process.env.EMAIL_AUTH_PASS, // your SMTP password
    },
  });
  // Create a Nodemailer transporter using SMTP
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Replace with your mail server host
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_AUTH_USER, // your SMTP username
      pass: process.env.EMAIL_AUTH_PASS, // your SMTP password
    },
  });

  // Email content
  let mailOptions = {
    from: `"Meme Generator" ${process.env.EMAIL_AUTH_USER}`,
    to: userEmail,
    subject: "Password Reset Request",
    text: "You requested a password reset",
    html: `<b>Click on the following link to reset your password:</b> <a href="${process.env.FRONT_END_DOMAIN}password_reset/${resetToken}">Reset Password</a>`,
  };

  // Send the email
  try {
    let info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error sending email: ", error);
  }
}

module.exports = { sendPasswordResetEmail };
