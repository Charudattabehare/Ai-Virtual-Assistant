import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAssistant } from "../context/AssistantContext";
import { 
    HiOutlineXMark, 
    HiOutlineSparkles, 
    HiOutlineSpeakerWave, 
    HiOutlineCheck,
    HiOutlineAdjustmentsHorizontal
} from "react-icons/hi2";

const defaultAssistantNames = ["Jarvis", "Friday", "Nova", "CyberCore", "Aria", "Atlas"];

const SettingsModal = ({ isOpen, onClose }) => {
    const { user, updateAssistantSettings } = useAuth();
    const { availableVoices, selectedVoice, setSelectedVoice, speakText } = useAssistant();

    const [assistantName, setAssistantName] = useState(user?.assistantName || "Jarvis");
    const [speechRate, setSpeechRate] = useState(user?.speechRate || 1.0);
    const [speechPitch, setSpeechPitch] = useState(user?.speechPitch || 1.0);
    const [autoSpeak, setAutoSpeak] = useState(user?.autoSpeak ?? true);
    const [savedNotice, setSavedNotice] = useState(false);

    if (!isOpen) return null;

    const handleSave = async (e) => {
        e.preventDefault();
        await updateAssistantSettings({
            assistantName,
            speechRate: parseFloat(speechRate),
            speechPitch: parseFloat(speechPitch),
            autoSpeak
        });
        setSavedNotice(true);
        setTimeout(() => {
            setSavedNotice(false);
            onClose();
        }, 800);
    };

    const handleTestVoice = () => {
        speakText(`Configuration test successful. My name is ${assistantName}, and I am calibrated to your voice specifications.`);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            
            {/* Modal Card */}
            <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-b from-[#0a1835] via-[#060e22] to-[#030712] border border-cyan-500/40 p-6 shadow-[0_0_50px_rgba(0,210,255,0.25)] text-gray-200">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-400 text-cyan-300">
                            <HiOutlineAdjustmentsHorizontal className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white tracking-wide">Assistant Configuration</h2>
                            <p className="text-xs font-mono text-cyan-400">NEURAL CORE PARAMETERS</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                        <HiOutlineXMark className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSave} className="mt-5 space-y-5">
                    
                    {/* Assistant Name Selection */}
                    <div>
                        <label className="block text-xs font-mono text-cyan-300 mb-2 uppercase tracking-wider">
                            Assistant Identity Designation
                        </label>
                        <div className="grid grid-cols-3 gap-2 mb-2.5">
                            {defaultAssistantNames.map(name => (
                                <button
                                    type="button"
                                    key={name}
                                    onClick={() => setAssistantName(name)}
                                    className={`py-1.5 px-3 rounded-xl border text-xs font-mono font-medium transition-all ${
                                        assistantName.toLowerCase() === name.toLowerCase()
                                            ? "bg-cyan-500/20 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,210,255,0.4)]"
                                            : "bg-[#061226] border-white/10 text-gray-400 hover:border-cyan-500/30 hover:text-gray-200"
                                    }`}
                                >
                                    {name}
                                </button>
                            ))}
                        </div>
                        <input
                            type="text"
                            value={assistantName}
                            onChange={(e) => setAssistantName(e.target.value)}
                            placeholder="Or enter custom name..."
                            className="w-full px-3.5 py-2 rounded-xl bg-[#040c1d] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                        />
                    </div>

                    {/* Speech Voice Selection */}
                    {availableVoices.length > 0 && (
                        <div>
                            <label className="block text-xs font-mono text-cyan-300 mb-2 uppercase tracking-wider">
                                Vocal Synthesizer Voice Model
                            </label>
                            <select
                                value={selectedVoice?.name || ""}
                                onChange={(e) => {
                                    const v = availableVoices.find(item => item.name === e.target.value);
                                    if (v) setSelectedVoice(v);
                                }}
                                className="w-full px-3.5 py-2 rounded-xl bg-[#040c1d] border border-cyan-500/30 text-white text-sm focus:outline-none focus:border-cyan-400"
                            >
                                {availableVoices.map((v, idx) => (
                                    <option key={idx} value={v.name} className="bg-[#060e22] text-white">
                                        {v.name} ({v.lang})
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Vocal Speed & Pitch Sliders */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                                <span>Voice Rate</span>
                                <span className="text-cyan-400">{speechRate}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.6"
                                max="1.6"
                                step="0.1"
                                value={speechRate}
                                onChange={(e) => setSpeechRate(e.target.value)}
                                className="w-full accent-cyan-400 bg-gray-700 h-1.5 rounded-lg cursor-pointer"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between text-xs font-mono text-gray-300 mb-1">
                                <span>Voice Pitch</span>
                                <span className="text-cyan-400">{speechPitch}x</span>
                            </div>
                            <input
                                type="range"
                                min="0.7"
                                max="1.4"
                                step="0.1"
                                value={speechPitch}
                                onChange={(e) => setSpeechPitch(e.target.value)}
                                className="w-full accent-cyan-400 bg-gray-700 h-1.5 rounded-lg cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Auto Speak Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-[#040c1d] border border-cyan-500/20">
                        <div>
                            <p className="text-xs font-medium text-white">Auto Vocal Responses</p>
                            <p className="text-[11px] text-gray-400">Speak AI responses aloud automatically</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoSpeak}
                                onChange={(e) => setAutoSpeak(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-2">
                        <button
                            type="button"
                            onClick={handleTestVoice}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#081735] border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/20 transition-all"
                        >
                            <HiOutlineSpeakerWave className="w-4 h-4" />
                            Test Vocal
                        </button>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 rounded-xl bg-gray-800/80 text-gray-300 text-xs font-semibold hover:bg-gray-700 transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black text-xs font-bold font-mono tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,210,255,0.4)]"
                            >
                                {savedNotice ? (
                                    <>
                                        <HiOutlineCheck className="w-4 h-4" />
                                        Saved
                                    </>
                                ) : (
                                    <>
                                        <HiOutlineSparkles className="w-4 h-4" />
                                        Apply Config
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default SettingsModal;
