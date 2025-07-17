const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

//set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
    

const passportConfig = require('./passport_config/passport');
passportConfig(passport);   
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());



app.use(flash());
const User = require('./models/User');

const signupRoutes = require('./routes/signupRouter');
const signinRoutes = require('./routes/signinRouter');
const verificationRoutes = require('./routes/verificationRouter');
const { ensureAuthenticated, ensure2FA, ensureVerified } = require('./passport_config/auth');

app.get('/', (req, res) => {
    res.render('index');
});
app.use('/signin', signinRoutes);
app.use('/signup', signupRoutes);
app.use('/verification', verificationRoutes);

app.get('/homepage', ensureAuthenticated,(req, res) => {
    res.render('homepage', {
        user: req.user.email
    });
});
app.get('/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Logout failed');
        }
        res.clearCookie('email');
        res.redirect('/');
    });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});