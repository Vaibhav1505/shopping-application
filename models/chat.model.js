const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    orderId: {

        type: mongoose.Types.ObjectId,
        required: true

    },
    content: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        required: true

    },

}, { timestamps: true })

const chat = mongoose.model('chat', chatSchema);

module.exports = chat;