const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");

exports.user_signup = function(req, res, next) {
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
                            username: req.body.username,
                            age: req.body.age,
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

exports.user_signin = function(req, res, next) {
    console.log(req.body);
    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                console.log("Authorization Failed");
                return res.render("error");
            }
            bcrypt.compare(req.body.password, user.password, (err, decoded) => {
                if (err) {
                    console.log("Error in comparing Passwords");
                    return res.redirect("error");
                }

                if (decoded) {
                    const verificationToken = jwt.sign({
                            email: req.body.email,
                        },
                        process.env.jwt_key, {
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
            return res.redirect("error");
        });
};

exports.get_user_profile = function(req, res, next) {
    User.findOne({ email: req.payload.email })
        .then((user) => {
            res.render("user/profile", user);
        })
        .catch((e) => {
            res.status(500).json(e);
        });
};

exports.add_to_cart = async function(req, res, next) {
    const productId = req.body.productId;
    const productName = req.body.productName;
    const email = req.payload.email;

    /** Getting all products */
    const products = await Product.find({});
    const productChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
    }
    User.findOneAndUpdate({ email }, {
            $addToSet: {
                products: {
                    productId,
                    quantity: 1,
                },
            },
        }, {
            new: true,
        })
        .then((user) => {
            res.redirect('/?message=' +
                productName + 'added successfully& type = success ');
        })
        .catch((e) => {
            console.log(e.message);
            res.redirect('/?message=Could not add product&type=error');
        });
};