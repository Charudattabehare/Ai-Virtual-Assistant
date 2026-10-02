import express from "express";
import { signUp, Login, logOut, getMe, updateSettings } from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", Login);
authRouter.post("/login", Login);
authRouter.post("/logout", logOut);
authRouter.get("/me", protectRoute, getMe);
authRouter.put("/settings", protectRoute, updateSettings);

export default authRouter;
