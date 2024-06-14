const mongoose = require("mongoose");
const bcrypt = require('bcrypt-nodejs')

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

userSchema.method.encryptedPassword = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
};

userSchema.method.matchedPassword = function(password) {
    return bcrypt.compare(password, this.password)
}
const User = mongoose.model("User", userSchema);

module.exports = User;