const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
exports.user_signup = function (req, res, next) {
  console.log(req.body);
  User.findOne({ email: req.body.email })

    .then((user) => {
      if (user) {
        console.log("User Already Exist");
      } else {
        bcrypt.hash(req.body.password, 5, (err, hash) => {
          if (err) {
            console.log(err);
            console.log("Error in Password Hashing");
          } else {
            const newUser = new User({
              email: req.body.email,
              password: hash,
            });
            newUser
              .save()
              .then((validatedUser) => {
                // res.status(200).json({
                //     message: "Validated Used",
                //     user: validatedUser,
                // });
                res.redirect("/user/signin");
              })
              .catch((err) => {
                res.render("error");
                res.json({
                  error: err,
                });
              });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.redirect("error");
    });
};

exports.user_signin = function (req, res, next) {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user.length < 1) {
        console.log("Authorization Failed");
        res.redirect("error");
      }
      bcrypt.compare(req.body.password, user.password, (err, decoded) => {
        if (err) {
          console.log("Error in comparing Passwords");
          res.redirect("error");
        }
        if (decoded) {
          const verificationToken = jwt.sign(
            {
              email: req.body.email,
            },
            process.env.jwt_key,
            {
              expiresIn: "1h",
            }
          );
          console.log("Token: " + verificationToken);
          res.cookie("token", verificationToken);
          return res.render("user/any", {
            token: verificationToken,
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("error");
    });
};

exports.get_user_profile = function (req, res, next) {
  User.findOne({ email: req.payload.email })
    .then((user) => {
      res.render("user/profile", user);
    })
    .catch((e) => {
      res.status(500).json(e);
    });
};
