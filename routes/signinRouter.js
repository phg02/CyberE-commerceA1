const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const router = express.Router();

const User = require('../models/User');

router.post('/', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/homepage',
        failureRedirect: '/signin',
        failureFlash: true,
    })(req, res, next);
}); 

router.get('/', (req, res) => {
    res.render('signin');
});


module.exports = router;