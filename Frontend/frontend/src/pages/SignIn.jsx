import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import bg from "../assets/signup-robot-bg.svg";
import { 
    HiOutlineEnvelope, 
    HiOutlineLockClosed, 
    HiOutlineEye, 
    HiOutlineEyeSlash,
    HiOutlineCpuChip,
    HiOutlineBolt
} from "react-icons/hi2";

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const { signIn, guestLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        if (!email || !password) {
            setErrorMsg("Please provide both email and password.");
            return;
        }

        setLoading(true);
        const res = await signIn(email, password);
        setLoading(false);

        if (res.success) {
            navigate("/");
        } else {
            setErrorMsg(res.error || "Authentication failed.");
        }
    };

    const handleGuestAccess = () => {
        guestLogin();
        navigate("/");
    };

    return (
        <div
            className="min-h-screen w-full bg-[#030712] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4 relative cyber-grid"
            style={{ backgroundImage: `linear-gradient(rgba(3, 7, 18, 0.85), rgba(3, 7, 18, 0.95)), url(${bg})` }}
        >
            {/* Ambient Sci-Fi Flares */}
            <div className="absolute top-1/4 left-1/3 w-80 h-80 bg-cyan-500/15 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Glassmorphic Portal Terminal Card */}
            <div className="relative w-full max-w-md rounded-3xl bg-[#061024]/85 border border-cyan-500/30 backdrop-blur-2xl p-8 shadow-[0_0_50px_rgba(0,210,255,0.2)] text-gray-200">
                
                {/* Header Badge */}
                <div className="flex flex-col items-center text-center mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/50 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,210,255,0.4)] mb-3">
                        <HiOutlineCpuChip className="w-8 h-8 animate-pulse" />
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide">
                        Portal <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Sign In</span>
                    </h1>
                    <p className="text-xs font-mono text-cyan-300 mt-1 uppercase tracking-widest">
                        AUTHENTICATE NEURAL OPERATOR
                    </p>
                </div>

                {/* Error Notice */}
                {errorMsg && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono text-center animate-shake">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    
                    {/* Email Input */}
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
                                className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#040916] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-xs font-mono text-cyan-300 mb-1.5 uppercase tracking-wider">
                            Security Key / Password
                        </label>
                        <div className="relative flex items-center">
                            <HiOutlineLockClosed className="absolute left-3.5 w-5 h-5 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full pl-11 pr-11 py-3 rounded-xl bg-[#040916] border border-cyan-500/30 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
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

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold font-mono tracking-wider uppercase text-sm shadow-[0_0_20px_rgba(0,210,255,0.4)] transition-all cursor-pointer disabled:opacity-50"
                    >
                        {loading ? "INITIALIZING LINK..." : "AUTHORIZE ACCESS"}
                    </button>

                    {/* Quick Demo Access Button */}
                    <button
                        type="button"
                        onClick={handleGuestAccess}
                        className="w-full py-2.5 rounded-xl bg-[#08152e] hover:bg-[#0c2044] border border-cyan-500/30 text-cyan-300 font-mono text-xs tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_10px_rgba(0,210,255,0.1)]"
                    >
                        <HiOutlineBolt className="w-4 h-4 text-cyan-400" />
                        INSTANT GUEST DEMO ACCESS
                    </button>

                </form>

                {/* Footer Link */}
                <div className="mt-6 text-center text-xs font-mono text-gray-400">
                    New to Neural Core?{" "}
                    <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold hover:underline">
                        Register Operator
                    </Link>
                </div>

            </div>
        </div>
    );
}

export default SignIn;
