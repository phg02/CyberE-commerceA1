const mongoose = require('mongoose');
const { type } = require('os');
const { authenticate } = require('passport');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    otp: String,
    otpExpires: Date,
    isVerified: { type: Boolean, default: false },
    isAuthenticate:{type: Boolean, default: false},
    secret: String
});

const User = mongoose.model('User', userSchema);
module.exports = User;