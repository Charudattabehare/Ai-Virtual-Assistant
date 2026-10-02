import React from "react";
import { useAssistant } from "../context/AssistantContext";
import { HiMicrophone, HiOutlineSparkles, HiOutlineExclamationTriangle } from "react-icons/hi2";

const TechReactorOrb = () => {
    const { isListening, isSpeaking, isProcessing, toggleListening, transcript, speechError, speechSupported } = useAssistant();

    // Determine state color schemes
    let ringColor = "border-cyan-400";
    let stateLabel = "CORE READY • CLICK TO ACTIVATE";
    let stateTextColor = "text-cyan-400";

    if (isListening) {
        ringColor = "border-red-500";
        stateLabel = "LISTENING TO VOICE FEED...";
        stateTextColor = "text-red-400";
    } else if (isProcessing) {
        ringColor = "border-purple-400";
        stateLabel = "PROCESSING NEURAL INFERENCE...";
        stateTextColor = "text-purple-400";
    } else if (isSpeaking) {
        ringColor = "border-emerald-400";
        stateLabel = "TRANSMITTING VOCAL SYNTHESIS...";
        stateTextColor = "text-emerald-400";
    }

    return (
        <div className="relative flex flex-col items-center justify-center p-4 sm:p-6 select-none">
            
            {/* Ambient Back Glow */}
            <div 
                className="absolute w-64 sm:w-72 h-64 sm:h-72 rounded-full blur-3xl pointer-events-none transition-all duration-700 opacity-60"
                style={{ backgroundColor: isListening ? '#ef4444' : isProcessing ? '#8b5cf6' : isSpeaking ? '#10b981' : '#00d2ff' }}
            ></div>

            {/* Main Interactive Reactor Core Container */}
            <div 
                onClick={toggleListening}
                className="relative cursor-pointer group flex items-center justify-center w-52 h-52 sm:w-64 sm:h-64 rounded-full transition-transform duration-300 active:scale-95"
            >
                {/* Outer Dashed Orbit Ring 1 */}
                <div className={`absolute inset-0 rounded-full border border-dashed ${ringColor}/40 animate-spin-slow`}></div>

                {/* Outer Dashed Orbit Ring 2 (Reversed) */}
                <div className={`absolute inset-3 rounded-full border-2 border-dashed ${ringColor}/30 animate-spin-reverse`}></div>

                {/* Cyber Geometric Accents */}
                <div className="absolute inset-6 rounded-full border border-cyan-500/20">
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]"></span>
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]"></span>
                    <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]"></span>
                    <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00d2ff]"></span>
                </div>

                {/* Pulsing Core Sphere */}
                <div 
                    className={`relative flex flex-col items-center justify-center w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-gradient-to-b from-[#0e2a4a] via-[#051326] to-[#020712] border-2 ${
                        isListening ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.7)]" :
                        isProcessing ? "border-purple-400 shadow-[0_0_40px_rgba(168,85,247,0.7)]" :
                        isSpeaking ? "border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.7)]" :
                        "border-cyan-400 shadow-[0_0_35px_rgba(0,210,255,0.5)] group-hover:shadow-[0_0_50px_rgba(0,210,255,0.8)] group-hover:border-cyan-300"
                    } transition-all duration-300`}
                >
                    {/* Inner Holographic Glow Grid */}
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(0,210,255,0.25)_0%,transparent_70%)] animate-pulse"></div>

                    {/* Microphone Icon or Dynamic Audio Wave Bars */}
                    {isSpeaking ? (
                        <div className="flex items-center gap-1.5 z-10">
                            <span className="w-1.5 bg-cyan-300 rounded-full animate-wave-1"></span>
                            <span className="w-1.5 bg-cyan-400 rounded-full animate-wave-2"></span>
                            <span className="w-1.5 bg-cyan-300 rounded-full animate-wave-3"></span>
                            <span className="w-1.5 bg-emerald-300 rounded-full animate-wave-4"></span>
                            <span className="w-1.5 bg-cyan-300 rounded-full animate-wave-5"></span>
                            <span className="w-1.5 bg-cyan-400 rounded-full animate-wave-6"></span>
                            <span className="w-1.5 bg-cyan-300 rounded-full animate-wave-7"></span>
                        </div>
                    ) : isListening ? (
                        <div className="flex flex-col items-center gap-1 z-10">
                            <HiMicrophone className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 animate-bounce" />
                            <span className="text-[10px] font-mono text-red-300 font-bold tracking-widest uppercase">REC</span>
                        </div>
                    ) : isProcessing ? (
                        <div className="flex flex-col items-center gap-2 z-10">
                            <HiOutlineSparkles className="w-10 h-10 sm:w-12 sm:h-12 text-purple-300 animate-spin" />
                            <span className="text-[10px] font-mono text-purple-300 font-bold tracking-widest uppercase">THINKING</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 z-10 group-hover:scale-110 transition-transform">
                            <HiMicrophone className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400 drop-shadow-[0_0_12px_#00d2ff]" />
                            <span className="text-[10px] font-mono text-cyan-300 tracking-wider">TAP TO TALK</span>
                        </div>
                    )}

                    {/* Scanline Sweep inside orb */}
                    <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none opacity-20">
                        <div className="w-full h-1 bg-cyan-300 blur-[1px] animate-[scanline_3s_linear_infinite]"></div>
                    </div>
                </div>
            </div>

            {/* Live Transcript / Subtitle / Error Display */}
            <div className="mt-4 text-center max-w-lg px-4">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${isListening ? "bg-red-400 animate-ping" : "bg-cyan-400"}`}></span>
                    <span className={`text-[11px] font-mono tracking-widest uppercase font-semibold ${stateTextColor}`}>
                        {stateLabel}
                    </span>
                </div>

                {speechError ? (
                    <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
                        <HiOutlineExclamationTriangle className="w-4 h-4 flex-shrink-0" />
                        <span>{speechError}</span>
                    </div>
                ) : transcript ? (
                    <p className="text-cyan-200 text-sm md:text-base font-mono bg-[#08152e]/90 border border-cyan-500/30 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(0,210,255,0.2)] animate-pulse">
                        "{transcript}"
                    </p>
                ) : (
                    <p className="text-gray-400 text-xs font-mono">
                        {speechSupported ? "Speak commands aloud or tap quick actions below" : "Speech recognition active. Use Chrome or Edge for full vocal control."}
                    </p>
                )}
            </div>

        </div>
    );
};

export default TechReactorOrb;
