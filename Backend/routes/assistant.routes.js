import express from "express";
import { askAssistant, getHistory, clearHistory } from "../controllers/assistant.controller.js";
import { optionalAuth, protectRoute } from "../middlewares/auth.middleware.js";

const assistantRouter = express.Router();

assistantRouter.post("/ask", optionalAuth, askAssistant);
assistantRouter.get("/history", protectRoute, getHistory);
assistantRouter.delete("/history", protectRoute, clearHistory);

export default assistantRouter;
