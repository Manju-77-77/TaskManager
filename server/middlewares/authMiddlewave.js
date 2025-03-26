import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectRoute = async(req, res, next) => {
    try {
        // Check for token in cookies
        let token = req.cookies.token;

        // If no token, check Authorization header
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res
                .status(401)
                .json({ status: false, message: "Not authorized. No token provided." });
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find user and attach to request
        const resp = await User.findById(decodedToken.userId).select("isAdmin email");

        if (!resp) {
            return res
                .status(401)
                .json({ status: false, message: "User not found." });
        }

        req.user = {
            email: resp.email,
            isAdmin: resp.isAdmin,
            userId: decodedToken.userId,
        };

        next();
    } catch (error) {
        console.error(error);

        // Handle specific JWT errors
        if (error.name === 'TokenExpiredError') {
            return res
                .status(401)
                .json({ status: false, message: "Token expired. Please login again." });
        }

        return res
            .status(401)
            .json({ status: false, message: "Not authorized. Try login again." });
    }
};

const isAdminRoute = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(401).json({
            status: false,
            message: "Not authorized as admin. Try login as admin.",
        });
    }
};

export { isAdminRoute, protectRoute };