import jwt from "jsonwebtoken";
import { findUserById } from "../models/user.store.js";

export const protectRoute = async (req, res, next) => {
    try {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

        const secret = process.env.JWT_SECRET || "virtual_assistant_super_secret_cyber_jwt_2026";
        const decoded = jwt.verify(token, secret);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ message: "Unauthorized: Invalid token payload" });
        }

        const user = await findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ message: "Operator not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Token expired or invalid" });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token) {
            const secret = process.env.JWT_SECRET || "virtual_assistant_super_secret_cyber_jwt_2026";
            const decoded = jwt.verify(token, secret);
            if (decoded?.userId) {
                const user = await findUserById(decoded.userId);
                if (user) {
                    req.user = user;
                }
            }
        }
    } catch {
        // Continue unauthenticated if token fails
    }
    next();
};
