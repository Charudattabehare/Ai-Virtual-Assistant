import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import User from "./user.model.js";

// Local fallback JSON file in case MongoDB is offline
const LOCAL_STORE_FILE = path.join(process.cwd(), "users_local_fallback.json");

const loadLocalUsers = () => {
    try {
        if (fs.existsSync(LOCAL_STORE_FILE)) {
            const data = fs.readFileSync(LOCAL_STORE_FILE, "utf-8");
            return JSON.parse(data);
        }
    } catch (err) {
        console.warn("Failed to read local users file:", err.message);
    }
    return [];
};

const saveLocalUsers = (users) => {
    try {
        fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(users, null, 2), "utf-8");
    } catch (err) {
        console.warn("Failed to write local users file:", err.message);
    }
};

let inMemoryUsers = loadLocalUsers();

export const isMongoConnected = () => {
    return mongoose.connection.readyState === 1;
};

export const findUserByEmail = async (email) => {
    const normalized = email.toLowerCase().trim();
    if (isMongoConnected()) {
        try {
            return await User.findOne({ email: normalized });
        } catch (err) {
            console.warn("MongoDB findOne failed, using local store:", err.message);
        }
    }
    const found = inMemoryUsers.find(u => u.email.toLowerCase() === normalized);
    return found || null;
};

export const findUserById = async (id) => {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
        try {
            return await User.findById(id).select("-password");
        } catch (err) {
            console.warn("MongoDB findById failed, using local store:", err.message);
        }
    }
    const found = inMemoryUsers.find(u => String(u._id) === String(id));
    if (found) {
        const copy = { ...found };
        delete copy.password;
        return copy;
    }
    return null;
};

export const createUser = async ({ name, email, password, assistantName }) => {
    const normalized = email.toLowerCase().trim();
    if (isMongoConnected()) {
        try {
            const user = await User.create({
                name: name.trim(),
                email: normalized,
                password,
                assistantName: assistantName?.trim() || "Jarvis"
            });
            return user.toObject ? user.toObject() : user;
        } catch (err) {
            console.warn("MongoDB create failed, saving to local store:", err.message);
        }
    }

    const newUser = {
        _id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        name: name.trim(),
        email: normalized,
        password,
        assistantName: assistantName?.trim() || "Jarvis",
        assistantAvatar: "reactor-core",
        assistantVoice: "default",
        speechRate: 1.0,
        speechPitch: 1.0,
        autoSpeak: true,
        theme: "cyber-blue",
        history: [],
        createdAt: new Date().toISOString()
    };

    inMemoryUsers.push(newUser);
    saveLocalUsers(inMemoryUsers);
    return newUser;
};

export const updateUser = async (id, updateData) => {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
        try {
            const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select("-password");
            if (user) return user.toObject ? user.toObject() : user;
        } catch (err) {
            console.warn("MongoDB update failed, updating local store:", err.message);
        }
    }

    const idx = inMemoryUsers.findIndex(u => String(u._id) === String(id));
    if (idx !== -1) {
        inMemoryUsers[idx] = { ...inMemoryUsers[idx], ...updateData };
        saveLocalUsers(inMemoryUsers);
        const copy = { ...inMemoryUsers[idx] };
        delete copy.password;
        return copy;
    }
    return null;
};

export const appendHistory = async (id, items) => {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
        try {
            await User.findByIdAndUpdate(id, {
                $push: {
                    history: {
                        $each: items,
                        $slice: -100
                    }
                }
            });
            return;
        } catch (err) {
            console.warn("MongoDB appendHistory failed:", err.message);
        }
    }

    const idx = inMemoryUsers.findIndex(u => String(u._id) === String(id));
    if (idx !== -1) {
        if (!Array.isArray(inMemoryUsers[idx].history)) {
            inMemoryUsers[idx].history = [];
        }
        inMemoryUsers[idx].history.push(...items);
        if (inMemoryUsers[idx].history.length > 100) {
            inMemoryUsers[idx].history = inMemoryUsers[idx].history.slice(-100);
        }
        saveLocalUsers(inMemoryUsers);
    }
};

export const clearUserHistory = async (id) => {
    if (isMongoConnected() && mongoose.Types.ObjectId.isValid(id)) {
        try {
            await User.findByIdAndUpdate(id, { $set: { history: [] } });
            return;
        } catch (err) {
            console.warn("MongoDB clearHistory failed:", err.message);
        }
    }

    const idx = inMemoryUsers.findIndex(u => String(u._id) === String(id));
    if (idx !== -1) {
        inMemoryUsers[idx].history = [];
        saveLocalUsers(inMemoryUsers);
    }
};
