const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();
const env = require('dotenv');
env.config();


const User = require('../models/User');
// const signupRoutes = require('./routes/signupRouter');
router.get('/captchav2', (req, res) => {
    res.render('signup');
});
router.post('/captchav2', async(req, res) => {
    const response_key = req.body["g-recaptcha-response"];
    const params =  new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY,
        response: response_key,
        remoteip: req.ip,
    });
    console.log(params);

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: params,
    });
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success) {
        return res.status(400).send('Captcha verification failed');
    }

    // Validate input
    const { email, password } = req.body;
    const dbemail = await User.findOne({email: email});
    if(dbemail){
            throw new Error('Email already exists');
    }
        //hashpassword
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ email:email, password:hashPassword });
        await user.save();
        res.status(201).send('User created successfully, sending OTP to email');
    } catch (err) {
        res.status(500).send('Error: ' + err.message);
    }
});


router.get('/captchav3', (req, res) => {
    res.render('signupV3');
});

router.post('/captchav3', async (req, res) => {
    const response_key = req.body["g-recaptcha-response"];
    const params = new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY_V3,
        response: response_key,
        remoteip: req.ip,
    });
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        body: params,
    });
    const recaptchaData = await recaptchaResponse.json();
    if (!recaptchaData.success || recaptchaData.score < 0.4) {
        return res.status(400).send('Captcha verification failed');
    }
    // Validate input
    const { email, password, confirmPassword } = req.body;
    const dbemail = await User.findOne({email: email.js});
    if(dbemail){
            throw new Error('Email already exists');
    }
        //hashpassword
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ email:email, password:hashPassword });
        await user.save();
        res.status(201).send('User created successfully, sending OTP to email');
    } catch (err) {
        res.send('Error: ' + err.message);
    }
})

module.exports = router;