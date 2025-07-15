export const ensureAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/signin');
};

export const ensureVerified = function (req, res, next) {
    if (req.user.isVerified === true) {
        return next();
    }
    res.redirect('/signin');
};


export const ensure2FA = function (req, res, next) {
    if (req.user.isAuthenticate === true) {
        return next();
    }
    res.redirect('/signin');
};