const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin-model");
require("dotenv").config();

module.exports = async (req, res, next) => {
    try {
        let token = req.headers.token
        
        if (token) {
            let admin = jwt.verify(token, process.env.JWT_KEY)
            next()
        }
        else {
            throw new Error("")
        }
    } catch (error) {
        res.send({ success: false, data: "Error verifying user login" })
    }
};