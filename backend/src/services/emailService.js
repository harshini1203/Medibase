const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS, 
  },
});

/**
 * Sends a verification email with a JWT token that expires in 10 minutes.
 * @param {string} email - The recipient's email address.
 */
const sendVerificationEmail = async (email) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Medibase - Verify Your Email",
      text: `Click the link to verify your email: ${verificationLink}`,
      html: ` <p>Click <a href="${verificationLink}" style="color: #1a73e8; text-decoration: none;">here</a> to verify your email.</p>
        <p>This link will expire in <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

const sendVerificationEmailPasswordReset = async (email) => {
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

    const verificationLink = `http://localhost:3000/reset-password?token=${token}`;


    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Medibase - Rest Your Password",
      text: `Click the link to verify your email and reset your password: ${verificationLink}`,
      html: ` <p>Click <a href="${verificationLink}" style="color: #1a73e8; text-decoration: none;">here</a> to verify your email and reset your password.</p>
        <p>This link will expire in <b>10 minutes</b>.</p>
        <p>If you did not request this, please ignore this email.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Verification email sent to:", email);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

const sendFilesEmail = async (doctorEmail, sessionId) => {
  try {
      // Generate a JWT token that expires in 1 hour
      const token = jwt.sign({ sessionId }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Secure link for the doctor to access the session
      const link = `http://localhost:3000/view-files/${sessionId}?token=${token}`;

      // Configure Nodemailer
      const transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }
      });

      // Email content
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: doctorEmail,
          subject: 'Secure Access to Patient Files',
          text: `You have been granted secure access to patient files. Click the link below to view them:\n\n${link}\n\nThis link will expire in 1 hour for security reasons.`
      };

      // Send Email
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to', doctorEmail);
  } catch (error) {
      console.error('Error sending email:', error);
  }
};

module.exports = { sendVerificationEmail, sendFilesEmail, sendVerificationEmailPasswordReset };

