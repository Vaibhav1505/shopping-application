var express = require("express");
var router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/product.model");
const app = express();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
require("dotenv").config();
const userController = require("../controllers/userController");
const productController = require('../controllers/productController')

const checkAuth = require("../middleware/checkAuth");






/* GET home page. */
router.get("/", checkAuth, async function(req, res, next) {

    // Checking if page/form has a search keyword. We look if keyword is not undefined, that means if its not undefined then it has a value

    // then storing it in a variable called "keyword"
    let keyword = "";
    if (req.query.keyword !== undefined) {
        keyword = req.query.keyword;
    }



    // Fetching products to show on page
    const products = await Product.find({ title: { $regex: keyword, $options: "i" } });
    const productChunks = [];
    const chunkSize = 3;
    for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
    }


    // Fetching user details for cart items
    let user = null;

    user = await User.findOne({ email: req.payload.email });


    let totalCartItems = 0;

    for (let i = 0; i < user.products.length; i++) {
        totalCartItems = totalCartItems + user.products[i].quantity;

    }




    res.render("shop/index", {
        totalCartItems,
        title: "Demo Shopping Application",
        products: productChunks,
    });

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

router.post("/products", productController.create_products);

router.get("/products", function(req, res, next) {
    res.render("shop/addProduct");
});


router.post('/add_to_cart', checkAuth, userController.add_to_cart)

module.exports = router;