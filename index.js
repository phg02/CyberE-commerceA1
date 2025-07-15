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

//set up view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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

// const signupRoutes = require('./routes/signupRouter');
app.get('/', (req, res) => {
    res.render('signup');
});
app.post('/signup', async(req, res) => {
    const { email, password } = req.body;
    const dbemail = await User.findOne({email: req.body.email});
    if(dbemail){
            throw new Error('Email already exists');
    }
        //hashpassword
    const hashPassword = await bcrypt.hash(password, 10);
    try {
        const user = new User({ email:email, password:hashPassword });
        await user.save();
        res.status(201).send('User created successfully');
    } catch (err) {
        res.send('Error: ' + err.message);
    }
});

app.post('/signin', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/homepage',
        failureRedirect: '/signin',
        failureFlash: true,
    })(req, res, next);
}); 

app.get('/signin', (req, res) => {
    res.render('signin');
});

app.get('/homepage', (req, res) => {
    res.send('Welcome to the homepage!');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});