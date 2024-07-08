const jwt = require("jsonwebtoken");
const adminModel = require("../models/admin-model");
require("dotenv").config();

module.exports = async (req, res, next) => {
    // Check if the cookies exist and if the token is present
    if (!req.cookies || !req.cookies.token) {
        return res.json({ success: false, data: "You need to login first" });
    }
    try {
        // Verify the token
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        // Find the admin user without the password field
        const admin = await adminModel.findOne({ username: decoded.username }).select("-password");

        if (!admin) {
            return res.json({ success: false, data: "Invalid token or user not found" });
        }

        // Attach the admin user to the request object for further use
        req.admin = admin;

        // Call the next middleware or route handler
        next();
    } catch (err) {
        return res.json({ success: false, data: "There was an error verifying" });
    }
};
