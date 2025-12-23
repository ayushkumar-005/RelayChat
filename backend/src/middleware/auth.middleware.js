import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
    try {
        // Check if token is present or not
        const token = req.cookies.jwt;
        if (!token)
            return res
                .status(401)
                .json({ message: "Unauthorized - No token provided" });

        // Check if token is valid or not
        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        if (!decoded)
            return res
                .status(401)
                .json({ message: "Unauthorized - Invalid token" });

        // Check if user is present in DB or not
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        // If everything passes call next function: updateProfile()
        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
