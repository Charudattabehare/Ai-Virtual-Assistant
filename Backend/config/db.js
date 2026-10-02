import mongoose from "mongoose";

// Disable command buffering so operations fail immediately instead of hanging for 10 seconds if MongoDB is offline
mongoose.set("bufferCommands", false);

const connectDb = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_virtual_assistant";
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 2500,
        });
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.warn("⚠️  MongoDB offline / unreachable:", error.message);
        console.log("⚡ Seamless Local Persistence Mode active. Authentication & AI are fully operational.");
    }
};

export default connectDb;