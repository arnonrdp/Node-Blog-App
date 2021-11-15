module.exports = {
    isAdmin: (req, res, next) => {
        if (req.isAuthenticated() && req.user.isAdmin === 1) {
            return next();
        }
        req.flash("error_msg", "You must be an admin to do that!");
        res.redirect("/");
    }
}