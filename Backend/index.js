import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import assistantRouter from "./routes/assistant.routes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Allow multiple frontend development origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000"
];

app.use(cors({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps, curl, postman)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Permissive in dev mode for smooth user experience
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Health check endpoint
app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ONLINE", system: "AI Virtual Assistant Core", uptime: process.uptime() });
});

// API Routes
app.use("/api/auth", authRouter);
app.use("/api/assistant", assistantRouter);

// Start server
app.listen(port, () => {
    connectDb();
    console.log(`🚀 AI Virtual Assistant Server running on http://localhost:${port}`);
});