import express from "express";
import path from "path";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";

const app = express();
const port = ENV.PORT || 8000;

app.use(express.json()); // req.body
app.use(cookieParser());

const __dirname = path.resolve();

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Deployment init
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    // Send index.html for any other endpoint
    app.get(/.*/, (_, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
}

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    connectDB();
});
