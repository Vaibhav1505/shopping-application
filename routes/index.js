var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");
const app = express();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userController = require("../controllers/userController");

const checkAuth = require("../middleware/checkAuth");

/* GET home page. */
router.get("/", async function(req, res, next) {
    const products = await Product.find({});
    const productChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
    }
    // Product.insertMany(products);
    res.render("shop/index", {
        title: "Demo Shopping Application",
        products: productChunks,
    });
    console.log(productChunks);
});

router.get("/user/signup", function(req, res, next) {
    res.render("user/signup");
});

router.post(
    "/user/signup",
    userController.user_signup

    // console.log(email)
);

router.get("/user/signin", function(req, res, next) {
    res.render("user/signin");
});

router.post("/user/signin", userController.user_signin);

router.get("/user/profile", checkAuth, userController.get_user_profile);

router.get("/user/error", function(req, res, next) {
    res.render("error");
});

module.exports = router;