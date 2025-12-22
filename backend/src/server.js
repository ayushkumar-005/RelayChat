import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json()); // req.body

const __dirname = path.resolve();

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Deployment init
if (process.env.NODE_ENV === "production") {
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
