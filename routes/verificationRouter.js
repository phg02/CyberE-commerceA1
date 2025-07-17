const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const router = express.Router();
const env = require('dotenv');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const User = require('../models/User');
env.config();


router.post('/verify-email-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).send('Email is required');
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).send('User not found');
    }
    const verificationCode = otpGenerator.generate(6, { digits:true, lowerCaseAlphabets: false, upperCaseAlphabets:false, specialChars: false});
    user.otp = verificationCode;
    user.otpExpires = Date.now() + 2 * 60 * 1000;
    await user.save();
    const transporter =   nodemailer.createTransport({
        host: 'smtp.gmail.com',
        secure: true, // true for 465, false for other ports
        logger: false,
        debug: false, // include SMTP traffic in the logs
        secureConnection: false, // use TLS 
        port: 465,
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,  
        subject: 'Email Verification',
        text: `Your verification code is ${verificationCode}. It is valid for 2 minutes.`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        res.cookie('email', email, { maxAge: 2 *   60 * 1000, httpOnly: true }); 
        res.status(200).send('Verification code sent to your email');
    });
});

router.get('/verify-email-otp', (req, res) => {
    const { email } = req.query;
    if (!email) {
        return res.status(400).send('Email is required');
    }
    res.render('otp-verification', { email });
});


router.post('/verify', async (req, res) => {
    const {verificationCode } = req.body;
    const email = req.cookies.email;

    console.log('Email from cookie:', email);
    console.log('Verification code:', verificationCode);
    const User = require('../models/User');
    if (!email || !verificationCode) {
        return res.status(400).send('Email and verification code are required');
    }
    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(404).send('User not found');
    }
    if (user.otp !== verificationCode || user.verificationCodeExpires < user.otpExpires) {
        return res.status(400).send('Invalid or expired verification code');
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).send('Email verified successfully');
})

module.exports = router;