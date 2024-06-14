const mongoose = require("mongoose");

//1.30 #4

const productSchema = new mongoose.Schema({
    imagePath: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
});

const product = mongoose.model("product", productSchema);

module.exports = product;