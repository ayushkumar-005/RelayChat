import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";

export const generateToken = (userId, res) => {
    const { JWT_SECRET } = ENV;
    if (!JWT_SECRET) {
        throw new Error("JWT Secret isn't configured");
    }

    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: "14d",
    });

    res.cookie("jwt", token, {
        maxAge: 14 * 24 * 60 * 60 * 1000,
        httpOnly: true, // Prevent XSS attacks
        sameSite: "strict", // CSRF attacks
        secure: ENV.NODE_ENV === "development" ? false : true,
    });

    return token;
};
