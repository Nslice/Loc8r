const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


passport.use(new LocalStrategy({
        usernameField: "email"
    },
    function (username, password, done) {
        User.findOne({
                email: username
            },
            function (err, user) {
                if (!user)
                    return done(null, false, {message: "Incorrect username"});
                if (!user.validPassword(password))
                    return done(null, false, {message: "Incorrect password"});
                return done(null, user);

            });
    }
));