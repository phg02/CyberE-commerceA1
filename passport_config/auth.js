export const ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin');
};

export const ensureVerified = async function (req, res, next) {
    if (req.user.isVerified === true) {
        return next();
    }
    console.log(req.user.email);
    const email = req.user.email;

    if (!email) {
        return res.status(400).send('Email is required for verification');
    }
    res.redirect('/verification/verify-email-otp?email=' + req.user.email);
};


export const ensure2FA = function (req, res, next) {
    if (req.user.isAuthenticate === true) {
        return next();
    }
    res.redirect('/signin');
};