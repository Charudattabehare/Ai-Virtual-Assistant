import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/signup-robot-bg.svg";
import { 
    HiOutlineUser, 
    HiOutlineEnvelope, 
    HiOutlineLockClosed, 
    HiOutlineEye, 
    HiOutlineEyeSlash,
    HiOutlineSparkles,
    HiOutlineCpuChip
} from "react-icons/hi2";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [assistantName, setAssistantName] = useState("Jarvis");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name.trim() || !email.trim() || !password) {
            setErrorMsg("All required fields must be populated.");
            return;
        }

        if (password.length < 6) {
            setErrorMsg("Security key must be at least 6 characters.");
            return;
        }

        setLoading(true);
        const res = await signUp(name, email, password, assistantName);
        setLoading(false);

        if (res.success) {
            navigate("/");
        } else {
            setErrorMsg(res.error || "Registration encountered an anomaly.");
        }
    };

    return (
        <div
            className="min-h-screen w-full bg-[#030712] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative cyber-grid"
            style={{ backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.85), rgba(3, 7, 18, 0.95)), url(${bg})` }}
        >
            {/* Ambient Lighting */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Registration Terminal Card */}
            <div className="relative w-full max-w-md rounded-3xl bg-[#061024]/85 border border-cyan-500/30 backdrop-blur-2xl p-8 shadow-[0_0_50px_rgba(0,210,255,0.2)] text-gray-200">
                
                {/* Header Badge */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.4)] mb-3">
                        <HiOutlineCpuChip className="w-8 h-8 animate-pulse" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                        Register <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Virtual Assistant</span>
                    </h1>
                    <p className="text-xs font-mono text-cyan-300 mt-1 uppercase tracking-widest">
                        CREATE OPERATOR PROFILE
                    </p>
                </div>

                {/* Error Banner */}
                {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono text-center animate-shake">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase tracking-wider">
                            Operator Name
                        </label>
                        <div className="relative flex items-center">
                            <HiOutlineUser className="absolute left-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Charudatta"
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#040916] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase tracking-wider">
                            Operator Email
                        </label>
                        <div className="relative flex items-center">
                            <HiOutlineEnvelope className="absolute left-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@cyber.core"
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#040916] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                        </div>
                    </div>

                    {/* Assistant Name Designation */}
                    <div>
                        <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase tracking-wider">
                            Custom Assistant Name
                        </label>
                        <div className="relative flex items-center">
                            <HiOutlineSparkles className="absolute left-3.5 w-5 h-5 text-cyan-400" />
                            <input
                                type="text"
                                value={assistantName}
                                onChange={(e) => setAssistantName(e.target.value)}
                                placeholder="Jarvis, Friday, Nova..."
                                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-[#040916] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase tracking-wider">
                            Security Key / Password (Min 6 chars)
                        </label>
                        <div className="relative flex items-center">
                            <HiOutlineLockClosed className="absolute left-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-11 py-2.5 rounded-xl bg-[#040916] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-400 hover:text-cyan-300 transition-colors"
                            >
                                {showPassword ? <HiOutlineEyeSlash className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono tracking-wider uppercase text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "CONFIGURING NEURAL SYSTEM..." : "INITIALIZE & REGISTER"}
                    </button>

                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-xs font-mono text-gray-400">
                    Already registered?{" "}
                    <Link to="/signin" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
                        Sign In Portal
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default SignUp;