const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function authMiddleware(req, res, next) {
    if (req.headers["authorization" === undefined]) {
        return res.json({
            message: "Token not provided",
        });
    }
    try {
        const token = req.headers["authorization"].split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.email = decoded.email;

        next();
    } catch (error) {
        return res.json({
            message:"invalid token",
        })
    }
}
module.exports = authMiddleware;