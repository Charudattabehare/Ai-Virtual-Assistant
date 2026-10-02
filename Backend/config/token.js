import jwt from "jsonwebtoken";

const genToken = (userId) => {
    try {
        const secret = process.env.JWT_SECRET || "virtual_assistant_super_secret_key_2026";
        const token = jwt.sign({ userId }, secret, { expiresIn: "10d" });
        return token;
    } catch (error) {
        console.error("Token generation error:", error);
        return null;
    }
};

export default genToken;