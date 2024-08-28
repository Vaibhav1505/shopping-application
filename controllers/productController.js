const Product = require("../models/product.model");
exports.create_products = function(req, res, next) {
    const newProduct = new Product({
        imagePath: req.body.imagePath,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
    });

    newProduct
        .save()
        .then((product) => {
            console.log(product.title, "Created");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
            res.render("error", { error: err });
        });
};

exports.get_product_detail = function(req, res, next) {
    Product.findOne({ _id: req.params.productId })
        .then((product) => {
            res.render("product/productDetails", product);
        })
        .catch((e) => {
            console.log(
                "There is an Error in fetching product detials using product ID"
            );
            res.render("error", { error: e });
        });
};

exports.get_all_prodcuts = function(req, res, next) {
    Product.find()
        .then((result) => {
            res.json({
                resultData: result,
            });
        })
        .catch((e) => {
            console.log("Error" + e);
        });
};