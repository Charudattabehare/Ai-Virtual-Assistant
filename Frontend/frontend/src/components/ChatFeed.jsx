import React, { useRef, useEffect, useState } from "react";
import { useAssistant } from "../context/AssistantContext";
import { useAuth } from "../context/AuthContext";
import { 
    HiOutlineSpeakerWave, 
    HiOutlineClipboardDocument, 
    HiOutlineCheck,
    HiOutlineArrowTopRightOnSquare,
    HiOutlineCpuChip,
    HiOutlineUser
} from "react-icons/hi2";

const ChatFeed = () => {
    const { messages, speakText, isProcessing } = useAssistant();
    const { user } = useAuth();
    const messagesEndRef = useRef(null);
    const [copiedId, setCopiedId] = useState(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isProcessing]);

    const handleCopy = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex flex-col h-full overflow-y-auto pr-2 space-y-4 font-sans custom-scroll">
            {messages.map((msg) => {
                const isUser = msg.role === "user";

                return (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                    >
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border ${
                            isUser 
                                ? "bg-blue-600/30 border-blue-400 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                                : "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,210,255,0.3)]"
                        }`}>
                            {isUser ? <HiOutlineUser className="w-4 h-4" /> : <HiOutlineCpuChip className="w-4 h-4" />}
                        </div>

                        {/* Message Box */}
                        <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 border backdrop-blur-md ${
                            isUser
                                ? "bg-gradient-to-br from-[#0c234b]/90 to-[#07132a]/90 border-blue-500/40 text-blue-50 rounded-tr-none shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                                : "bg-gradient-to-br from-[#071630]/90 to-[#030a17]/90 border-cyan-500/30 text-cyan-50 rounded-tl-none shadow-[0_0_15px_rgba(0,210,255,0.15)]"
                        }`}>
                            {/* Header / Meta */}
                            <div className="flex items-center justify-between gap-4 mb-1.5 text-[11px] font-mono text-gray-400">
                                <span className={`font-semibold ${isUser ? "text-blue-300" : "text-cyan-300"}`}>
                                    {isUser ? (user?.name || "OPERATOR") : (user?.assistantName || "JARVIS")}
                                </span>
                                <span>{msg.timestamp || "Now"}</span>
                            </div>

                            {/* Message Body */}
                            <div className="text-sm leading-relaxed whitespace-pre-wrap select-text font-normal text-gray-200">
                                {msg.content}
                            </div>

                            {/* Triggered Action Pill */}
                            {msg.action && (
                                <div className="mt-3 pt-2 border-t border-cyan-500/20 flex items-center justify-between gap-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono text-cyan-300 uppercase tracking-wider">
                                        ACTION: {msg.action.replace('_', ' ')}
                                    </span>
                                    {msg.actionData?.url && (
                                        <a 
                                            href={msg.actionData.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-xs text-cyan-400 hover:text-cyan-200 flex items-center gap-1 font-mono hover:underline"
                                        >
                                            {msg.actionData.title || "Open Link"}
                                            <HiOutlineArrowTopRightOnSquare className="w-3.5 h-3.5" />
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* Message Toolbar for Assistant */}
                            {!isUser && (
                                <div className="mt-2.5 pt-1.5 flex items-center gap-2 text-gray-400 text-xs">
                                    <button
                                        onClick={() => speakText(msg.content)}
                                        title="Read aloud"
                                        className="p-1 rounded hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                                    >
                                        <HiOutlineSpeakerWave className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleCopy(msg.content, msg.id)}
                                        title="Copy message"
                                        className="p-1 rounded hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                                    >
                                        {copiedId === msg.id ? (
                                            <HiOutlineCheck className="w-3.5 h-3.5 text-emerald-400" />
                                        ) : (
                                            <HiOutlineClipboardDocument className="w-3.5 h-3.5" />
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}

            {/* AI Thinking Indicator */}
            {isProcessing && (
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300 flex items-center justify-center animate-pulse">
                        <HiOutlineCpuChip className="w-4 h-4" />
                    </div>
                    <div className="p-3 rounded-2xl rounded-tl-none bg-[#071630]/80 border border-cyan-500/30 flex items-center gap-2 font-mono text-xs text-cyan-300">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                        Neural Processing Core Active...
                    </div>
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
};

export default ChatFeed;
