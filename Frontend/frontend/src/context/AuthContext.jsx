import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("va_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });
    const [token, setToken] = useState(() => localStorage.getItem("va_token") || null);
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(null);

    // Set default axios header whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            localStorage.setItem("va_token", token);
        } else {
            delete axios.defaults.headers.common["Authorization"];
            localStorage.removeItem("va_token");
        }
    }, [token]);

    // Save user to localStorage
    useEffect(() => {
        if (user) {
            localStorage.setItem("va_user", JSON.stringify(user));
        } else {
            localStorage.removeItem("va_user");
        }
    }, [user]);

    // Check current user session on mount
    useEffect(() => {
        const verifySession = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                    withCredentials: true
                });
                if (response.data?.user) {
                    setUser(response.data.user);
                }
            } catch (err) {
                console.warn("Session verification warning:", err.message);
                // If offline or mongo not ready, keep cached user or allow fallback
            } finally {
                setLoading(false);
            }
        };

        verifySession();
    }, [token]);

    const signIn = async (email, password) => {
        setAuthError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
                email,
                password
            }, { withCredentials: true });

            if (response.data?.token) {
                setToken(response.data.token);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
            throw new Error(response.data?.message || "Login failed");
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to sign in";
            setAuthError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    const signUp = async (name, email, password, assistantName = "Jarvis") => {
        setAuthError(null);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
                name,
                email,
                password,
                assistantName
            }, { withCredentials: true });

            if (response.data?.token) {
                setToken(response.data.token);
                setUser(response.data.user);
                return { success: true, user: response.data.user };
            }
            throw new Error(response.data?.message || "Sign up failed");
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || "Failed to sign up";
            setAuthError(errorMsg);
            return { success: false, error: errorMsg };
        }
    };

    // Fast guest access for demo and instant use
    const guestLogin = () => {
        const guestUser = {
            _id: "guest_" + Date.now(),
            name: "Cyber Operative",
            email: "guest@cyber.nexus",
            assistantName: "Jarvis",
            assistantAvatar: "reactor-core",
            assistantVoice: "default",
            speechRate: 1.0,
            speechPitch: 1.0,
            autoSpeak: true,
            theme: "cyber-blue"
        };
        setUser(guestUser);
        setToken("guest_token_demo");
        return { success: true, user: guestUser };
    };

    const signOut = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, { withCredentials: true });
        } catch {
            // ignore network issues during logout
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem("va_token");
            localStorage.removeItem("va_user");
        }
    };

    const updateAssistantSettings = async (newSettings) => {
        // Optimistic UI update
        setUser(prev => ({ ...prev, ...newSettings }));
        if (token && token !== "guest_token_demo") {
            try {
                await axios.put(`${API_BASE_URL}/auth/settings`, newSettings, { withCredentials: true });
            } catch (err) {
                console.warn("Failed to persist settings to server:", err.message);
            }
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                authError,
                signIn,
                signUp,
                guestLogin,
                signOut,
                updateAssistantSettings
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
