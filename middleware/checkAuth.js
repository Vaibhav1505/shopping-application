const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    try {
        console.log("Incoming token", req.cookies.token);
        const incomingToken = req.cookies.token;
        const decodedVerifiedToken = jwt.verify(incomingToken, process.env.jwt_key);
        req.payload = decodedVerifiedToken;
        next();
    } catch (error) {
        console.log(error);
    }
};