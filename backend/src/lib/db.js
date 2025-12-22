import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const { MONGO_URI } = process.env;
        if (!MONGO_URI) throw new Error("MONGO_URI is not set");

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected", conn.connection.host);
    } catch (error) {
        console.log("Error in connecting to MongoDB:", error);
        process.exit(1);
    }
};
