import mongoose from "mongoose";

const historyItemSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        default: "user"
    },
    content: {
        type: String,
        required: true
    },
    action: {
        type: String,
        default: null
    },
    actionData: {
        type: mongoose.Schema.Types.Mixed,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String,
        default: "Jarvis"
    },
    assistantAvatar: {
        type: String,
        default: "reactor-core"
    },
    assistantVoice: {
        type: String,
        default: "default"
    },
    speechRate: {
        type: Number,
        default: 1.0
    },
    speechPitch: {
        type: Number,
        default: 1.0
    },
    autoSpeak: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        default: "cyber-blue"
    },
    history: [historyItemSchema]
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;