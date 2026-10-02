import React, { useState } from "react";
import Navbar from "../components/Navbar";
import TechReactorOrb from "../components/TechReactorOrb";
import ChatFeed from "../components/ChatFeed";
import QuickActions from "../components/QuickActions";
import SettingsModal from "../components/SettingsModal";
import { useAssistant } from "../context/AssistantContext";
import { useAuth } from "../context/AuthContext";
import { 
    HiPaperAirplane, 
    HiMicrophone, 
    HiOutlineCommandLine,
    HiOutlineShieldCheck,
    HiOutlineCpuChip,
    HiOutlineSignal
} from "react-icons/hi2";

const Home = () => {
    const { user } = useAuth();
    const { sendMessage, isListening, toggleListening, isProcessing } = useAssistant();
    const [inputPrompt, setInputPrompt] = useState("");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputPrompt.trim() || isProcessing) return;
        sendMessage(inputPrompt);
        setInputPrompt("");
    };

    return (
        <div className="min-h-screen bg-[#030712] text-gray-100 flex flex-col relative overflow-x-hidden cyber-grid">
            
            {/* Ambient Lighting FX */}
            <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>
            <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>

            {/* Top Navigation HUD */}
            <Navbar onOpenSettings={() => setIsSettingsOpen(true)} />

            {/* Main Command Dashboard Layout */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* Left Column: AI Reactor Core & Diagnostics (5 cols on lg) */}
                <div className="lg:col-span-5 flex flex-col gap-5">
                    
                    {/* Holographic Reactor Core Card */}
                    <div className="relative rounded-2xl bg-gradient-to-b from-[#08152e]/80 via-[#050e20]/80 to-[#030814]/90 border border-cyan-500/30 backdrop-blur-xl p-5 shadow-[0_0_25px_rgba(0,210,255,0.15)] flex flex-col items-center justify-between">
                        
                        {/* Terminal Card Header */}
                        <div className="w-full flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono">
                            <div className="flex items-center gap-2 text-cyan-300">
                                <HiOutlineCpuChip className="w-4 h-4 animate-spin-slow" />
                                <span className="font-bold tracking-wider">NEURAL REACTOR INTERFACE</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] text-cyan-300 tracking-widest uppercase">
                                LIVE STREAM
                            </span>
                        </div>

                        {/* Interactive Orb Visualizer */}
                        <div className="my-auto py-2">
                            <TechReactorOrb />
                        </div>

                        {/* Telemetry Stats Bar */}
                        <div className="w-full grid grid-cols-3 gap-2 pt-3 border-t border-cyan-500/20 text-center font-mono">
                            <div className="p-2 rounded-xl bg-[#040a16] border border-cyan-500/15">
                                <p className="text-[10px] text-gray-400">LATENCY</p>
                                <p className="text-xs text-cyan-400 font-bold">12ms</p>
                            </div>
                            <div className="p-2 rounded-xl bg-[#040a16] border border-cyan-500/15">
                                <p className="text-[10px] text-gray-400">CORE ENGINE</p>
                                <p className="text-xs text-emerald-400 font-bold">SYNCED</p>
                            </div>
                            <div className="p-2 rounded-xl bg-[#040a16] border border-cyan-500/15">
                                <p className="text-[10px] text-gray-400">AUDIO FEED</p>
                                <p className="text-xs text-cyan-400 font-bold">ACTIVE</p>
                            </div>
                        </div>
                    </div>

                    {/* Quick Shortcuts Matrix */}
                    <div className="rounded-2xl bg-[#061024]/70 border border-cyan-500/20 backdrop-blur-xl p-4 shadow-[0_0_20px_rgba(0,0,0,0.4)]">
                        <QuickActions />
                    </div>

                </div>

                {/* Right Column: AI Conversation Feed & Command Terminal (7 cols on lg) */}
                <div className="lg:col-span-7 flex flex-col h-[650px] lg:h-auto rounded-2xl bg-gradient-to-b from-[#08152e]/80 via-[#050e20]/80 to-[#030814]/90 border border-cyan-500/30 backdrop-blur-xl p-4 sm:p-5 shadow-[0_0_25px_rgba(0,210,255,0.15)]">
                    
                    {/* Feed Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 text-xs font-mono">
                        <div className="flex items-center gap-2 text-cyan-300">
                            <HiOutlineCommandLine className="w-4 h-4 text-cyan-400" />
                            <span className="font-bold tracking-wider">COMMAND LOG & NEURAL FEED</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                            <HiOutlineShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>ENCRYPTED CHANNEL</span>
                        </div>
                    </div>

                    {/* Chat Messages Scroll Area */}
                    <div className="flex-1 overflow-hidden py-4">
                        <ChatFeed />
                    </div>

                    {/* Interactive Input Bar */}
                    <form onSubmit={handleSubmit} className="pt-3 border-t border-cyan-500/20">
                        <div className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-[#040a17] border border-cyan-500/30 focus-within:border-cyan-400 focus-within:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-all">
                            
                            {/* Voice Button */}
                            <button
                                type="button"
                                onClick={toggleListening}
                                title={isListening ? "Stop listening" : "Start voice input"}
                                className={`p-3 rounded-xl transition-all ${
                                    isListening
                                        ? "bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse"
                                        : "bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/40"
                                }`}
                            >
                                <HiMicrophone className="w-5 h-5" />
                            </button>

                            {/* Prompt Input Field */}
                            <input
                                type="text"
                                value={inputPrompt}
                                onChange={(e) => setInputPrompt(e.target.value)}
                                placeholder={`Ask ${user?.assistantName || "Jarvis"} anything or speak command...`}
                                className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none font-sans"
                            />

                            {/* Send Button */}
                            <button
                                type="submit"
                                disabled={!inputPrompt.trim() || isProcessing}
                                className={`p-3 rounded-xl transition-all ${
                                    inputPrompt.trim() && !isProcessing
                                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black shadow-[0_0_15px_rgba(0,210,255,0.4)] cursor-pointer"
                                        : "bg-gray-800/50 text-gray-500 cursor-not-allowed border border-white/5"
                                }`}
                            >
                                <HiPaperAirplane className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex items-center justify-between mt-2 px-1 text-[11px] font-mono text-gray-400">
                            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-gray-800 border border-gray-700 text-cyan-300">Enter</kbd> to send</span>
                            <span>Voice Trigger: <span className="text-cyan-400">Mic / Space</span></span>
                        </div>
                    </form>

                </div>

            </main>

            {/* Assistant Settings Modal */}
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

        </div>
    );
};

export default Home;
