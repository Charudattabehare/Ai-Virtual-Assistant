import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AssistantContext = createContext(null);

// Web Audio API Sound Generator for Futuristic Cyber Feedback
const playCyberSound = (type = "activate") => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "activate") {
            // High-tech rising double chime
            osc.type = "sine";
            osc.frequency.setValueAtTime(587.33, now); // D5
            osc.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            osc.start(now);
            osc.stop(now + 0.2);
        } else if (type === "complete") {
            // Futuristic confirmation blip
            osc.type = "triangle";
            osc.frequency.setValueAtTime(880, now);
            osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        } else if (type === "error") {
            // Low warning buzz
            osc.type = "sawtooth";
            osc.frequency.setValueAtTime(220, now);
            osc.frequency.linearRampToValueAtTime(150, now + 0.25);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
            osc.start(now);
            osc.stop(now + 0.25);
        }
    } catch {
        // AudioContext not allowed before user interaction
    }
};

export const AssistantProvider = ({ children }) => {
    const { user } = useAuth();
    const assistantName = user?.assistantName || "Jarvis";

    // Chat Messages State
    const [messages, setMessages] = useState(() => {
        try {
            const saved = localStorage.getItem("va_messages");
            if (saved) return JSON.parse(saved);
        } catch {
            // fallback
        }
        return [
            {
                id: "welcome-1",
                role: "assistant",
                content: `System Online. Greetings! I am ${assistantName}, your AI Virtual Assistant. Click the glowing reactor core or press microphone to speak commands.`,
                action: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
    });

    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [speechError, setSpeechError] = useState("");
    const [speechSupported, setSpeechSupported] = useState(true);
    const [availableVoices, setAvailableVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);

    const recognitionRef = useRef(null);
    const synthRef = useRef(typeof window !== "undefined" ? window.speechSynthesis : null);
    const latestTranscriptRef = useRef("");
    const hasDispatchedRef = useRef(false);

    // Save messages to localStorage
    useEffect(() => {
        try {
            localStorage.setItem("va_messages", JSON.stringify(messages.slice(-50)));
        } catch {
            // ignore
        }
    }, [messages]);

    // Load browser TTS voices
    useEffect(() => {
        if (!synthRef.current) return;

        const loadVoices = () => {
            const voices = synthRef.current.getVoices();
            setAvailableVoices(voices);

            if (voices.length > 0) {
                const preferred = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("David") || v.name.includes("Zira"))) || voices.find(v => v.lang.startsWith("en")) || voices[0];
                setSelectedVoice(preferred);
            }
        };

        loadVoices();
        if (synthRef.current.onvoiceschanged !== undefined) {
            synthRef.current.onvoiceschanged = loadVoices;
        }
    }, []);

    // Stop speaking helper
    const stopSpeaking = useCallback(() => {
        if (synthRef.current) {
            synthRef.current.cancel();
            setIsSpeaking(false);
        }
    }, []);

    // Speak text using SpeechSynthesis
    const speakText = useCallback((text) => {
        if (!synthRef.current || !text) return;

        stopSpeaking();

        // Strip markdown, URLs and code brackets for clean vocal synthesis
        const cleanText = text
            .replace(/```[\s\S]*?```/g, "Code provided on terminal.")
            .replace(/`([^`]+)`/g, "$1")
            .replace(/https?:\/\/\S+/g, "link")
            .replace(/[#*_~>]/g, "")
            .trim();

        if (!cleanText) return;

        const utterance = new SpeechSynthesisUtterance(cleanText);

        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }

        utterance.rate = user?.speechRate || 1.0;
        utterance.pitch = user?.speechPitch || 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
        };

        synthRef.current.speak(utterance);
    }, [selectedVoice, user?.speechRate, user?.speechPitch, stopSpeaking]);

    // Forward ref to sendMessage so recognition callback can invoke it
    const sendMessageRef = useRef(null);

    // Send query to assistant
    const sendMessage = useCallback(async (textPrompt) => {
        const query = (textPrompt || transcript || latestTranscriptRef.current).trim();
        if (!query) return;

        hasDispatchedRef.current = true;
        latestTranscriptRef.current = "";
        setTranscript("");
        setIsListening(false);
        setSpeechError("");

        // Add user message to feed
        const userMsg = {
            id: "msg-" + Date.now(),
            role: "user",
            content: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setIsProcessing(true);
        stopSpeaking();

        try {
            const response = await axios.post(`${API_BASE_URL}/assistant/ask`, {
                prompt: query,
                assistantName
            }, { withCredentials: true });

            const data = response.data;
            const assistantMsg = {
                id: "msg-" + (Date.now() + 1),
                role: "assistant",
                content: data.response || "Task executed successfully.",
                action: data.action,
                actionData: data.actionData,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            setMessages(prev => [...prev, assistantMsg]);
            playCyberSound("complete");

            // Execute browser side actions (open tabs for YouTube, Google, GitHub, Maps, etc.)
            if (data.action === "open_url" && data.actionData?.url) {
                setTimeout(() => {
                    window.open(data.actionData.url, data.actionData.target || "_blank", "noopener,noreferrer");
                }, 500);
            }

            // Speak response if autoSpeak is enabled
            if (user?.autoSpeak !== false && data.response) {
                speakText(data.response);
            }

        } catch (error) {
            console.error("Ask assistant error:", error);
            playCyberSound("error");
            const fallbackReply = "I am operating in local fallback mode. Please check server status.";
            setMessages(prev => [
                ...prev,
                {
                    id: "msg-err-" + Date.now(),
                    role: "assistant",
                    content: fallbackReply,
                    action: null,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
            if (user?.autoSpeak !== false) {
                speakText(fallbackReply);
            }
        } finally {
            setIsProcessing(false);
        }
    }, [transcript, assistantName, speakText, stopSpeaking, user?.autoSpeak]);

    // Keep reference updated
    useEffect(() => {
        sendMessageRef.current = sendMessage;
    }, [sendMessage]);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("");
            setSpeechError("");
            latestTranscriptRef.current = "";
            hasDispatchedRef.current = false;
            stopSpeaking();
            playCyberSound("activate");
        };

        recognition.onresult = (event) => {
            let combined = "";
            for (let i = 0; i < event.results.length; i++) {
                combined += event.results[i][0].transcript;
            }
            const text = combined.trim();
            latestTranscriptRef.current = text;
            setTranscript(text);
        };

        recognition.onerror = (event) => {
            console.warn("Speech recognition error:", event.error);
            setIsListening(false);
            if (event.error === "not-allowed") {
                setSpeechError("Microphone blocked! Please allow mic access in your browser address bar.");
            } else if (event.error === "no-speech") {
                setSpeechError("No voice detected. Please try speaking closer to microphone.");
            } else if (event.error !== "aborted") {
                setSpeechError(`Voice Error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            // If recognized text exists and wasn't sent yet, send it now!
            const textToSend = latestTranscriptRef.current.trim();
            if (textToSend && !hasDispatchedRef.current && sendMessageRef.current) {
                sendMessageRef.current(textToSend);
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch {
                    // ignore
                }
            }
        };
    }, [stopSpeaking]);

    // Toggle Listening with fallback & error handling
    const toggleListening = useCallback(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSpeechError("Speech Recognition is not supported in this browser. Please use Google Chrome or Edge.");
            return;
        }

        if (isListening) {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch {
                    // ignore
                }
            }
            setIsListening(false);
        } else {
            setSpeechError("");
            setTranscript("");
            latestTranscriptRef.current = "";
            hasDispatchedRef.current = false;

            try {
                if (recognitionRef.current) {
                    recognitionRef.current.start();
                }
            } catch (err) {
                console.warn("Recognition start retry:", err);
                try {
                    recognitionRef.current.abort();
                    setTimeout(() => {
                        recognitionRef.current.start();
                    }, 150);
                } catch (retryErr) {
                    setSpeechError("Please click anywhere on page first or allow microphone permissions.");
                }
            }
        }
    }, [isListening]);

    // Clear conversation
    const clearChatHistory = async () => {
        setMessages([
            {
                id: "welcome-reset-" + Date.now(),
                role: "assistant",
                content: `History reset complete. All neural channels are clear, boss.`,
                action: null,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ]);
        stopSpeaking();

        try {
            await axios.delete(`${API_BASE_URL}/assistant/history`, { withCredentials: true });
        } catch {
            // ignore
        }
    };

    return (
        <AssistantContext.Provider
            value={{
                messages,
                isListening,
                isSpeaking,
                isProcessing,
                transcript,
                setTranscript,
                speechError,
                speechSupported,
                availableVoices,
                selectedVoice,
                setSelectedVoice,
                toggleListening,
                sendMessage,
                speakText,
                stopSpeaking,
                clearChatHistory
            }}
        >
            {children}
        </AssistantContext.Provider>
    );
};

export const useAssistant = () => {
    const context = useContext(AssistantContext);
    if (!context) {
        throw new Error("useAssistant must be used within an AssistantProvider");
    }
    return context;
};
