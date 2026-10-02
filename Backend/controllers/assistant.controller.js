import { appendHistory, findUserById, clearUserHistory } from "../models/user.store.js";

// Helper function to process commands and trigger browser actions
const processCommand = (prompt, assistantName = "Jarvis") => {
    const p = prompt.trim().toLowerCase();

    // 1. Open YouTube / Play Video
    if (p.includes("open youtube") || p.startsWith("play ") || p.includes("on youtube")) {
        let query = "";
        if (p.startsWith("play ")) {
            query = prompt.replace(/play/i, "").replace(/on youtube/i, "").trim();
        } else if (p.includes("youtube")) {
            query = prompt.replace(/open youtube and search for|open youtube and play|open youtube/i, "").trim();
        }
        const url = query ? `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}` : "https://www.youtube.com";
        return {
            response: query ? `Opening YouTube to play "${query}".` : "Opening YouTube now, boss.",
            action: "open_url",
            actionData: { url, target: "_blank", title: "YouTube" }
        };
    }

    // 2. Google Search / Open Google
    if (p.includes("open google") || p.startsWith("google ") || p.includes("search google for") || p.startsWith("search for ")) {
        let query = prompt
            .replace(/open google and search for|search google for|google search for|search for|open google|google/i, "")
            .trim();
        const url = query ? `https://www.google.com/search?q=${encodeURIComponent(query)}` : "https://www.google.com";
        return {
            response: query ? `Searching Google for "${query}".` : "Opening Google Search for you.",
            action: "open_url",
            actionData: { url, target: "_blank", title: "Google Search" }
        };
    }

    // 3. Open GitHub
    if (p.includes("open github") || p.includes("github profile") || p.includes("github repo")) {
        return {
            response: "Opening GitHub repositories and dashboard.",
            action: "open_url",
            actionData: { url: "https://github.com", target: "_blank", title: "GitHub" }
        };
    }

    // 4. Open Spotify / Music
    if (p.includes("open spotify") || p.includes("listen to spotify")) {
        return {
            response: "Launching Spotify for your music playlist.",
            action: "open_url",
            actionData: { url: "https://open.spotify.com", target: "_blank", title: "Spotify" }
        };
    }

    // 5. Open Wikipedia
    if (p.includes("open wikipedia") || p.includes("wikipedia search") || p.includes("search wikipedia for")) {
        let query = prompt.replace(/open wikipedia and search for|search wikipedia for|open wikipedia/i, "").trim();
        const url = query ? `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}` : "https://en.wikipedia.org";
        return {
            response: query ? `Searching Wikipedia knowledge base for "${query}".` : "Opening Wikipedia.",
            action: "open_url",
            actionData: { url, target: "_blank", title: "Wikipedia" }
        };
    }

    // 6. Open Maps / Location
    if (p.includes("open maps") || p.includes("open google maps") || p.startsWith("where is ") || p.includes("location of ")) {
        let loc = prompt.replace(/open maps|open google maps|where is|location of/i, "").trim();
        const url = loc ? `https://www.google.com/maps/search/${encodeURIComponent(loc)}` : "https://www.google.com/maps";
        return {
            response: loc ? `Locating "${loc}" on Google Maps.` : "Opening Google Maps navigation.",
            action: "open_url",
            actionData: { url, target: "_blank", title: "Google Maps" }
        };
    }

    // 7. Time & Date queries
    if (p.includes("what is the time") || p.includes("tell me the time") || p.includes("current time") || p === "time") {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        return {
            response: `The current system time is ${timeString}.`,
            action: "time_check",
            actionData: { time: timeString }
        };
    }

    if (p.includes("what is the date") || p.includes("today's date") || p.includes("tell me the date") || p === "date") {
        const now = new Date();
        const dateString = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
        return {
            response: `Today is ${dateString}.`,
            action: "date_check",
            actionData: { date: dateString }
        };
    }

    // 8. Math / Calculator
    if (p.startsWith("calculate ") || p.startsWith("what is ") && /[\d+\-*/^()]/.test(p)) {
        try {
            const sanitized = prompt.replace(/calculate|what is|equals|\?/gi, "").trim();
            if (/^[\d+\-*/%().\s]+$/.test(sanitized)) {
                // eslint-disable-next-line no-eval
                const result = Function(`'use strict'; return (${sanitized})`)();
                return {
                    response: `The calculation of ${sanitized} equals ${result}.`,
                    action: "calculator",
                    actionData: { expression: sanitized, result }
                };
            }
        } catch {
            // fallback
        }
    }

    // 9. Jokes & Easter Eggs
    if (p.includes("tell me a joke") || p.includes("say a joke") || p.includes("make me laugh")) {
        const jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "There are only 10 types of people in the world: those who understand binary, and those who don't.",
            "Why did the developer go broke? Because he used up all his cache!",
            "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
            "Why do Java developers wear glasses? Because they don't C#!"
        ];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        return {
            response: randomJoke,
            action: "joke",
            actionData: null
        };
    }

    // 10. Identity
    if (p.includes("who are you") || p.includes("what is your name") || p.includes("what can you do")) {
        return {
            response: `Greetings! I am ${assistantName}, your high-tech AI Virtual Assistant. I can execute voice commands, open apps, search the web, calculate formulas, check the time, synthesize voice, and assist you with programming and daily tasks.`,
            action: "status",
            actionData: null
        };
    }

    return null;
};

// Fallback intelligent conversation engine if external API is offline or not configured
const generateConversationalResponse = (prompt, assistantName = "Jarvis") => {
    const p = prompt.toLowerCase();

    if (p.includes("hello") || p.includes("hi") || p.includes("hey")) {
        return `Hello! ${assistantName} online and operational. How can I assist your workflow today?`;
    }

    if (p.includes("react") || p.includes("javascript") || p.includes("python") || p.includes("code") || p.includes("programming")) {
        return `As an AI programming assistant, I'm ready to write code, debug logic, configure APIs, or explain architectures. Feel free to ask your specific technical question!`;
    }

    if (p.includes("weather")) {
        return `Current meteorological telemetry indicates clear skies with optimal atmospheric conditions. Would you like me to open live radar maps?`;
    }

    if (p.includes("thank") || p.includes("thanks")) {
        return `You're very welcome! Always at your service. Let me know if you need anything else.`;
    }

    return `Understood. I have processed your input: "${prompt}". I am standing by to assist with research, development, system automation, and web intelligence.`;
};

// External Gemini call if GEMINI_API_KEY is available
const callGeminiApi = async (prompt, assistantName = "Jarvis") => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;

    try {
        const systemInstruction = `You are ${assistantName}, a sophisticated, futuristic, and highly intelligent AI Virtual Assistant with a cybernetic blue/black HUD interface. Keep responses concise, helpful, articulate, and futuristic yet direct. Avoid excessive markdown unless writing code.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [
                    {
                        role: "user",
                        parts: [
                            { text: `${systemInstruction}\n\nUser query: ${prompt}` }
                        ]
                    }
                ]
            })
        });

        if (!response.ok) {
            console.warn("Gemini API returned status:", response.status);
            return null;
        }

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return replyText || null;
    } catch (err) {
        console.warn("Gemini API call error:", err.message);
        return null;
    }
};

export const askAssistant = async (req, res) => {
    try {
        const { prompt, assistantName } = req.body;
        const currentAssistantName = assistantName || req.user?.assistantName || "Jarvis";

        if (!prompt || typeof prompt !== "string") {
            return res.status(400).json({ message: "Prompt is required." });
        }

        // 1. Check for deterministic command triggers (e.g. open apps, google, youtube, calculate, time)
        const commandResult = processCommand(prompt, currentAssistantName);

        let finalResponse = "";
        let action = null;
        let actionData = null;

        if (commandResult) {
            finalResponse = commandResult.response;
            action = commandResult.action;
            actionData = commandResult.actionData;
        } else {
            // 2. Try Gemini API first if configured
            const aiResponse = await callGeminiApi(prompt, currentAssistantName);
            if (aiResponse) {
                finalResponse = aiResponse;
            } else {
                // 3. Fallback to resilient conversational agent
                finalResponse = generateConversationalResponse(prompt, currentAssistantName);
            }
        }

        // Save history if user is authenticated
        if (req.user && req.user._id) {
            try {
                await appendHistory(req.user._id, [
                    { role: "user", content: prompt, action: null },
                    { role: "assistant", content: finalResponse, action, actionData }
                ]);
            } catch (histErr) {
                console.warn("History save warning:", histErr.message);
            }
        }

        return res.status(200).json({
            response: finalResponse,
            action,
            actionData,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error("Assistant ask error:", error);
        return res.status(500).json({
            message: "Assistant engine error",
            response: "Apologies, an internal processing anomaly occurred. System standing by."
        });
    }
};

export const getHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(200).json({ history: [] });
        }
        const user = await findUserById(req.user._id);
        return res.status(200).json({ history: user?.history || [] });
    } catch (error) {
        console.error("Get history error:", error);
        return res.status(500).json({ message: "Failed to retrieve history" });
    }
};

export const clearHistory = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(200).json({ message: "History cleared" });
        }
        await clearUserHistory(req.user._id);
        return res.status(200).json({ message: "Conversation history cleared successfully" });
    } catch (error) {
        console.error("Clear history error:", error);
        return res.status(500).json({ message: "Failed to clear history" });
    }
};
