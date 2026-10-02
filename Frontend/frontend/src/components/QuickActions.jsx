import React from "react";
import { useAssistant } from "../context/AssistantContext";
import { 
    HiOutlinePlay, 
    HiOutlineGlobeAlt, 
    HiOutlineCodeBracket, 
    HiOutlineClock, 
    HiOutlineFaceSmile, 
    HiOutlineAcademicCap, 
    HiOutlineCalculator, 
    HiOutlineMapPin 
} from "react-icons/hi2";

const actions = [
    {
        label: "Open YouTube",
        prompt: "Open YouTube",
        icon: HiOutlinePlay,
        color: "text-red-400 border-red-500/30 hover:border-red-400 bg-red-500/5 hover:bg-red-500/10"
    },
    {
        label: "Search Google",
        prompt: "Search Google for Latest AI News",
        icon: HiOutlineGlobeAlt,
        color: "text-blue-400 border-blue-500/30 hover:border-blue-400 bg-blue-500/5 hover:bg-blue-500/10"
    },
    {
        label: "Open GitHub",
        prompt: "Open GitHub",
        icon: HiOutlineCodeBracket,
        color: "text-purple-400 border-purple-500/30 hover:border-purple-400 bg-purple-500/5 hover:bg-purple-500/10"
    },
    {
        label: "System Time",
        prompt: "What is the time?",
        icon: HiOutlineClock,
        color: "text-cyan-400 border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10"
    },
    {
        label: "Tech Joke",
        prompt: "Tell me a tech joke",
        icon: HiOutlineFaceSmile,
        color: "text-amber-400 border-amber-500/30 hover:border-amber-400 bg-amber-500/5 hover:bg-amber-500/10"
    },
    {
        label: "Explain Quantum AI",
        prompt: "Explain Quantum Computing and AI in simple terms",
        icon: HiOutlineAcademicCap,
        color: "text-emerald-400 border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10"
    },
    {
        label: "Calculate Math",
        prompt: "Calculate (45 * 12) + 380",
        icon: HiOutlineCalculator,
        color: "text-indigo-400 border-indigo-500/30 hover:border-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10"
    },
    {
        label: "Google Maps",
        prompt: "Open Google Maps",
        icon: HiOutlineMapPin,
        color: "text-rose-400 border-rose-500/30 hover:border-rose-400 bg-rose-500/5 hover:bg-rose-500/10"
    }
];

const QuickActions = () => {
    const { sendMessage } = useAssistant();

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-3 text-xs font-mono text-cyan-400/80 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                Instant Telemetry Shortcuts
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {actions.map((act, index) => {
                    const Icon = act.icon;
                    return (
                        <button
                            key={index}
                            onClick={() => sendMessage(act.prompt)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border backdrop-blur-sm transition-all duration-200 text-left group hover:scale-[1.02] shadow-[0_0_10px_rgba(0,0,0,0.5)] ${act.color}`}
                        >
                            <div className="p-1.5 rounded-lg bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                                <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-medium text-gray-200 truncate">
                                {act.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickActions;
