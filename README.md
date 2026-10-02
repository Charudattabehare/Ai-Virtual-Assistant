# 🚀 AI Virtual Assistant (Futuristic Blue & Black Cyber Edition)

An intelligent, futuristic AI Virtual Assistant built with a high-tech Black & Electric Blue holographic interface, featuring real-time Speech-to-Text (STT), Text-to-Speech (TTS), an animated Cybernetic Reactor Core visualizer, web action triggers, and Gemini AI integration.

---

## ✨ Key Features

- 🌌 **Futuristic Cyberpunk UI**: Electric blue (`#00d2ff`) & deep cyber black theme, glowing borders, holographic HUD indicators, and animated telemetry.
- 🎙️ **Voice Recognition (STT)**: Hands-free voice commands using Web Speech API with real-time waveform reactions.
- 🔊 **Voice Synthesis (TTS)**: The AI speaks answers aloud with customizable voice rate, pitch, and voice models.
- ⚛️ **Holographic Reactor Core Orb**: Dynamic 3D-styled pulsing orbital ring visualizer responding to listening, processing, and speaking states.
- ⚡ **Instant Web Actions & Automation**:
  - `Open YouTube` / `Play <song> on YouTube`
  - `Search Google for <query>`
  - `Open GitHub` / `Open Spotify` / `Open Wikipedia`
  - `Check Current Time & Date`
  - `Math Calculations` & `Weather Queries`
  - `Tech Jokes & Programming Assistance`
- 🤖 **Gemini AI & Resilient Fallback Engine**: Supports Google Gemini API key or uses built-in smart NLP command engine.
- 🔐 **Authentication & Customization**:
  - Sign Up & Sign In with JWT authentication
  - One-click **Guest Demo Access**
  - Configurable assistant names (Jarvis, Friday, Nova, CyberCore) and voice preferences.

---

## 🛠️ Getting Started

### 1. Start the Backend Server
```bash
cd Backend
npm install
npm run dev
```
The server will run at `http://localhost:5000`.

*(Optional: Add your Gemini API key in `Backend/.env` if you wish to use Google's Gemini LLM directly)*

### 2. Start the Frontend
```bash
cd Frontend/frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, React Router 7, React Icons, Axios
- **Backend**: Node.js, Express 5, JWT, bcryptjs, Cookie-Parser, CORS, Mongoose, Dotenv
