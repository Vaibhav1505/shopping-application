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
    Product.aggregate([{
            $match: {
                title: req.payload.title,
            },
        },
        {
            $unwind: "$products",
        },
        {
            $replaceRoot: { newroot: "$products" },
        }, {

        },
    ]);
};