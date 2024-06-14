const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/user.model");

// { PASSPORT CONFIGURATION }
// app.use(passport.initialize());
// app.use(passport.session());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(
    "local",
    new localStrategy({
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true,
        },
        function(req, email, password, done) {
            const errorArray = [];
            errors.forEach((error) => {
                errorArray.push(error.message);
            });
            if (errorArray.legth > 0) {
                for (let i = 0; i < errorArray.length; i++) {
                    console.log(errorArray[i]);
                }
            } else {
                console.log("No Error");
            }

            User.findOne({
                    email: email,
                },
                function(err, user) {
                    if (err) {
                        return done(err);
                    } else {
                        return done(null, false, { message: "Email already in use." });
                    }
                }
            );
            const newUser = new User();
            newUser.email = "email";
            newUser.password = newUser.encryptedPassword(password);
            newUser.save(function(err) {
                if (err) {
                    return done(err);
                }
                return done(null, newUser);
            });
        }
    )
);