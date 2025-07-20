const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const router = express.Router();
const env = require("dotenv");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const QRCode = require("qrcode");
const speakeasy = require("speakeasy");
const { ensureAuthenticated } = require("../passport_config/auth");
env.config();

router.post("/verify-email-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  const verificationCode = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  user.otp = verificationCode;
  user.otpExpires = Date.now() + 2 * 60 * 1000;
  await user.save();
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    logger: false,
    debug: false, // include SMTP traffic in the logs
    secureConnection: false, // use TLS
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Your verification code is ${verificationCode}. It is valid for 2 minutes.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    res.cookie("email", email, { maxAge: 2 * 60 * 1000, httpOnly: true });
    res.status(200).send("Verification code sent to your email");
  });
});

router.get("/verify-email-otp", (req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  res.render("otp-verification", { email });
});

router.post("/verify", async (req, res) => {
  const { verificationCode } = req.body;
  const email = req.cookies.email;

  console.log("Email from cookie:", email);
  console.log("Verification code:", verificationCode);
  if (!email || !verificationCode) {
    return res.status(400).send("Email and verification code are required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (user.otp !== verificationCode || Date.now() > user.otpExpires) {
    return res.status(400).send("Invalid or expired verification code");
  }
  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.status(200).send("Email verified successfully");
});

router.get("/verify-signin-otp", async(req, res) => {
  const { email } = req.query;
  if (!email) {
    return res.status(400).send("Email is required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.cookie("email", email, { maxAge: 2 * 60 * 1000, httpOnly: true });
  const verificationCode = otpGenerator.generate(6, {
    digits: true,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  user.otp = verificationCode;
  user.otpExpires = Date.now() + 2 * 60 * 1000;
  await user.save();
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true, // true for 465, false for other ports
    logger: false,
    debug: false, // include SMTP traffic in the logs
    secureConnection: false, // use TLS
    port: 465,
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Your verification code is ${verificationCode}. It is valid for 2 minutes.`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email");
    }
    res.render("signin-otp-verification", { email: email });
  });
});

router.post("/verify-signin-otp", async (req, res) => {
  const { verificationCode } = req.body;
  const email = req.cookies.email;

  if (!email || !verificationCode) {
    return res.status(400).send("Email and verification code are required");
  }
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).send("User not found");
  }
  if (user.otp !== verificationCode || Date.now() > user.otpExpires) {
    return res.status(400).send("Invalid or expired verification code");
  }
  user.isAuthenticate= true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();
  res.status(200).send("Email verified successfully");
});

router.get("/2fa", async (req, res) => {
  res.render("2fa");
});

router.get("/2fa-setup", async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(404).send("User not found");

  if (!user.secret) return res.status(400).send("2FA not setup for this user");

  const otpauthURL = speakeasy.otpauthURL({
    secret: user.secret,
    label: `Phuong's Secure Web (${user.email})`,
    issuer: "Phuong's Secure Web",  
    encoding: "base32",
  });

  const qrCodeUrl = await QRCode.toDataURL(otpauthURL);
  res.render("2FASetUp", { qrCodeUrl });
});

router.post("/2fa", ensureAuthenticated, async (req, res) => {
  const { twoFACode } = req.body;
  const user = await User.findOne({ email: req.user.email });

  if (!user || !user.secret) {
    return res.status(404).send("User or 2FA not set up");
  }

  const verified = speakeasy.totp.verify({
    secret: user.secret,
    encoding: "base32",
    token: twoFACode,
    window: 1,
  });

  if (!verified) {
    return res.status(400).send("Invalid 2FA code");
  }

  user.isAuthenticate = true;
  await user.save();

  return res.status(200).send("2FA verification successful");
});
module.exports = router;
