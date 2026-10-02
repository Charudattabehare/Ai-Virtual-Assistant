import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAssistant } from "../context/AssistantContext";
import { 
    HiOutlineMicrophone, 
    HiOutlineCog6Tooth, 
    HiOutlineArrowRightOnRectangle, 
    HiOutlineSpeakerWave, 
    HiOutlineSpeakerXMark,
    HiOutlineTrash,
    HiOutlineCpuChip
} from "react-icons/hi2";

const Navbar = ({ onOpenSettings }) => {
    const { user, signOut } = useAuth();
    const { isListening, isSpeaking, stopSpeaking, clearChatHistory } = useAssistant();
    const [currentTime, setCurrentTime] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateClock();
        const interval = setInterval(updateClock, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = async () => {
        await signOut();
        navigate("/signin");
    };

    return (
        <header className="w-full bg-[#040915]/90 backdrop-blur-md border-b border-cyan-500/20 px-4 md:px-8 py-3 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                
                {/* Brand Logo / HUD Identity */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 group-hover:border-cyan-400 shadow-[0_0_15px_rgba(0,210,255,0.3)] transition-all">
                        <HiOutlineCpuChip className="w-6 h-6 text-cyan-400 animate-pulse" />
                        <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur group-hover:bg-cyan-400/20"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 text-lg">
                                {user?.assistantName || "NEXUS"}.AI
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono tracking-widest uppercase">
                                v2.6 Core
                            </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-mono tracking-wider">
                            NEURAL VIRTUAL ASSISTANT
                        </p>
                    </div>
                </Link>

                {/* Center Telemetry Status */}
                <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 rounded-full bg-[#061126]/80 border border-cyan-500/20 text-xs font-mono">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                                isListening ? "bg-red-400" : isSpeaking ? "bg-amber-400" : "bg-cyan-400"
                            }`}></span>
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                                isListening ? "bg-red-500" : isSpeaking ? "bg-amber-400" : "bg-cyan-400"
                            }`}></span>
                        </span>
                        <span className="text-gray-300">
                            STATUS: <span className={isListening ? "text-red-400 font-bold" : isSpeaking ? "text-amber-400 font-bold" : "text-cyan-400"}>
                                {isListening ? "LISTENING" : isSpeaking ? "VOCALIZING" : "SYSTEM ONLINE"}
                            </span>
                        </span>
                    </div>

                    <div className="w-[1px] h-3 bg-cyan-500/30"></div>

                    <div className="text-cyan-300 font-semibold tracking-widest">
                        {currentTime || "00:00:00"}
                    </div>
                </div>

                {/* Right Actions & User Menu */}
                <div className="flex items-center gap-3">
                    
                    {/* Audio Mute/Stop button */}
                    {isSpeaking && (
                        <button
                            onClick={stopSpeaking}
                            title="Stop vocal speech"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-mono transition-all animate-pulse"
                        >
                            <HiOutlineSpeakerXMark className="w-4 h-4" />
                            <span className="hidden sm:inline">Mute Voice</span>
                        </button>
                    )}

                    {/* Clear Chat */}
                    <button
                        onClick={clearChatHistory}
                        title="Clear Conversation Logs"
                        className="p-2 rounded-lg bg-[#08152e] border border-cyan-500/20 text-gray-400 hover:text-red-400 hover:border-red-500/40 hover:bg-red-500/10 transition-all text-sm"
                    >
                        <HiOutlineTrash className="w-4 h-4" />
                    </button>

                    {/* Settings Trigger */}
                    <button
                        onClick={onOpenSettings}
                        title="Assistant & Voice Settings"
                        className="flex items-center gap-2 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-[#08152e] border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 hover:border-cyan-400 shadow-[0_0_10px_rgba(0,210,255,0.15)] transition-all text-xs font-mono"
                    >
                        <HiOutlineCog6Tooth className="w-4 h-4 text-cyan-400" />
                        <span className="hidden md:inline">Configure</span>
                    </button>

                    {/* User profile / Logout */}
                    {user ? (
                        <div className="flex items-center gap-2 pl-2 border-l border-cyan-500/20">
                            <div className="hidden sm:block text-right font-mono">
                                <p className="text-xs font-semibold text-white truncate max-w-[110px]">{user.name}</p>
                                <p className="text-[10px] text-cyan-400/80">OPERATOR</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                title="Sign Out"
                                className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all text-sm"
                            >
                                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <Link
                            to="/signin"
                            className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                        >
                            Sign In
                        </Link>
                    )}
                </div>

            </div>
        </header>
    );
};

export default Navbar;
