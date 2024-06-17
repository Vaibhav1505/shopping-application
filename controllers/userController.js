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
                            expiresIn: "1d",
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
            res.redirect(
                "/?message=" + productName + "added successfully& type = success "
            );
        })
        .catch((e) => {
            console.log(e.message);
            res.redirect("/?message=Could not add product&type=error");
        });
};

exports.get_all_cart_items = function(req, res, next) {
    User.aggregate([{
                $match: {
                    email: req.payload.email,
                },
            },
            {
                $unwind: "$products",
            },
            {
                $replaceRoot: { newRoot: "$products" },
            },
            {
                $project: {
                    productId: {
                        $toObjectId: "$productId",
                    },
                    quantity: 1,
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "productInfo",
                },
            },
            {
                $unwind: "$productInfo",
            },
            {
                $project: {
                    imagePath: "$productInfo.imagePath",
                    title: "$productInfo.title",
                    description: "$productInfo.description",
                    price: "$productInfo.price",
                    quantity: 1,
                    productId: "$productInfo._id",
                },
            },
        ])
        .then((products) => {
            res.render("user/cart", { products });
        })
        .catch((err) => {
            console.log(err.message);
            res.render("error");
        });
};

exports.update_quantity = function(req, res, next) {
    const _id = req.query.productId;
    // const quantity = req.query.quantity;
    User.findOne({ email: req.payload.email })
        .then(async(user) => {
            for (let i = 0; i < user.products.length; i++) {
                console.log("Target ID", _id);
                console.log("Candidate Id", user.products[i].productId);
                if (user.products[i].productId == _id) {
                    if (req.query.type == "increase") {
                        user.products[i].quantity = user.products[i].quantity + 1;
                    } else {
                        user.products[i].quantity = user.products[i].quantity - 1;
                    }
                    console.log("QUNA TITY", user.products[i].quantity);
                    break;
                }
            }
            await user.save();
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err.message);
            res.render("error", { error: err });
        });
};

exports.remove_item = (req, res, next) => {
    const productId = req.query.productId;
    User.findOneAndUpdate({ email: req.payload.email }, { $pull: { products: { productId } } })
        .then((user) => {
            res.redirect("/cart");
        })
        .catch((err) => {
            console.log(err.message);
            res.render("error", { error: err });
        });
};