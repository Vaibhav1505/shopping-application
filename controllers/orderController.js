const Order = require("../models/order.model");
const User = require("../models/user.model");
const Chat = require('../models/chat.model')
const mongoose = require("mongoose");

exports.create_order = async function(req, res, next) {
    const user = await User.findOne({ email: req.payload.email });

    const newOrder = await new Order({
        email: req.payload.email,
        products: user.products,
        address: req.body.address,
    }).save();
    user.products = [];
    user
        .save()
        .then((order) => {
            console.log("Order Created..Go and check in Order Section");
            res.render("shop/order", {
                order,
            });
        })
        .catch((e) => {
            console.log("There is an Error in Creating the Order", e);
            res.render("error", e);
        });
};

exports.get_orders = function(req, res, next) {
    Order.aggregate([{
                $match: {
                    email: req.payload.email,
                },
            },
            { $unwind: "$products" },
            {
                $project: {
                    orderId: "$_id",
                    productId: "$products.productId",
                    quantity: "$products.quantity",
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
                    orderId: 1,
                    createdAt: 1,
                    imagePath: "$productInfo.imagePath",
                    title: "$productInfo.title",
                    description: "$productInfo.description",
                    price: "$productInfo.price",
                    quantity: 1,
                    productId: "$productInfo._id",
                },
            },
            {
                $group: {
                    _id: "$orderId",
                    items: {
                        $push: "$$ROOT",
                    },
                },
            },
        ])
        .then((orders) => {
            console.log({ orders });
            res.render("shop/order", { orders });
        })
        .catch((e) => {
            console.log(e.message);
            res.render("error", e);
        });
};

exports.get_order_details = function(req, res, next) {
    Order.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(req.params.orderId),
                },
            },
            { $unwind: "$products" },
            {
                $project: {
                    orderId: "$_id",
                    address: "$address",
                    productId: "$products.productId",
                    quantity: "$products.quantity",
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
                    orderId: 1,
                    createdAt: 1,
                    address: 1,
                    imagePath: "$productInfo.imagePath",
                    title: "$productInfo.title",
                    description: "$productInfo.description",
                    price: "$productInfo.price",
                    quantity: 1,
                    productId: "$productInfo._id",
                },
            },
            {
                $group: {
                    _id: { orderId: "$orderId", address: "$address" },

                    items: {
                        $push: "$$ROOT",
                    },
                    totalPric: { $sum: { $multiply: ["$price", "$quantity"] } },
                },
            },
            {
                $project: {
                    _id: 0,
                    orderId: "$_id.orderId",
                    title: "$_id.title",
                    address: "$_id.address",
                    price: "$_id.price",
                    products: "$items",
                    totalPrice: 1,
                },
            },
        ])
        .then((order) => {
            console.log(order[0]);

            // console.log(totalPrice);
            res.render("shop/orderDetails", order[0]);
        })
        .catch((err) => {
            console.log("error in fetching Order Details");
            res.render("error", err);
        });
};

exports.chat = function(req, res, next) {
    Chat.find({ orderId: req.params.orderId }).sort({ createdAt: -1 })
        .then((chats) => {
            console.log(chats)
            res.render("product/chat", { orderId: req.params.orderId, sender: req.payload.email, chats });
        })
        .catch((e) => {
            console.log(e);
            res.render("error", e);
        });
};

// exports.get_chat_deatils = function(req, res, next) {

// }