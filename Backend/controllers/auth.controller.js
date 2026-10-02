import bcrypt from "bcryptjs";
import { findUserByEmail, createUser, findUserById, updateUser } from "../models/user.store.js";
import genToken from "../config/token.js";

export const signUp = async (req, res) => {
    try {
        const { name, email, password, assistantName } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existEmail = await findUserByEmail(normalizedEmail);
        if (existEmail) {
            return res.status(400).json({ message: "Email already registered. Please sign in instead." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long." });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await createUser({
            name: name.trim(),
            email: normalizedEmail,
            password: hashPassword,
            assistantName: assistantName?.trim() || "Jarvis"
        });

        const token = genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        const userObj = { ...user };
        delete userObj.password;

        return res.status(201).json({
            message: "User registered successfully",
            token,
            user: userObj
        });
    } catch (error) {
        console.error("Sign up error:", error);
        return res.status(500).json({ message: `Sign up error: ${error.message}` });
    }
};

export const Login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required." });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await findUserByEmail(normalizedEmail);
        if (!user) {
            return res.status(400).json({ message: "No operator account found with this email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password. Access denied." });
        }

        const token = genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });

        const userObj = { ...user };
        delete userObj.password;

        return res.status(200).json({
            message: "Logged in successfully",
            token,
            user: userObj
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: `Login error: ${error.message}` });
    }
};

export const logOut = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production"
        });
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ message: `Logout error: ${error.message}` });
    }
};

export const getMe = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        return res.status(200).json({ user: req.user });
    } catch (error) {
        console.error("GetMe error:", error);
        return res.status(500).json({ message: "Failed to fetch operator profile" });
    }
};

export const updateSettings = async (req, res) => {
    try {
        const { assistantName, assistantAvatar, assistantVoice, speechRate, speechPitch, autoSpeak, theme } = req.body;

        const updateData = {};
        if (assistantName !== undefined) updateData.assistantName = assistantName;
        if (assistantAvatar !== undefined) updateData.assistantAvatar = assistantAvatar;
        if (assistantVoice !== undefined) updateData.assistantVoice = assistantVoice;
        if (speechRate !== undefined) updateData.speechRate = speechRate;
        if (speechPitch !== undefined) updateData.speechPitch = speechPitch;
        if (autoSpeak !== undefined) updateData.autoSpeak = autoSpeak;
        if (theme !== undefined) updateData.theme = theme;

        const user = await updateUser(req.user._id, updateData);

        return res.status(200).json({
            message: "Settings updated successfully",
            user
        });
    } catch (error) {
        console.error("Update settings error:", error);
        return res.status(500).json({ message: "Failed to update assistant settings" });
    }
};