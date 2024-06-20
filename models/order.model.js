const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    email: {
        type: String,

        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,

            required: true,
        },
        quantity: {
            type: Number,

            required: true,
        },
    }, ],
    address: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

const order = mongoose.model("order", orderSchema);

module.exports = order;