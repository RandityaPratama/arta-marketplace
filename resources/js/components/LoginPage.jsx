    import React from "react";
    import { useNavigate } from "react-router-dom";
    import { Mail, Lock } from "lucide-react";
    import Background from "./Background"


    export default function LoginPage() {
                const navigate = useNavigate();
        
    return (
        <>
        <Background>
        <div className="font-[Poppins] min-h-screen flex justify-center items-center px-4 py-8">
        <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl w-full">
            
            {/* Left side - Branding */}
            <div className="text-center md:text-center px-8">
            <div className="flex justify-start md:justify-start">
                <div className="bg-[#1E3A8A] p-3 rounded-lg">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="white"
                    className="w-8 h-8"
                >
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                    <path d="M9 9h6v6H9z" />
                    <path d="M7 12h10" />
                </svg>
                </div>
            </div>

            <h1 className="text-2xl font-bold text-[#1E3A8A] mt-4">
                ARTA MARKETPLACE
            </h1>

            <p className="font-bold text-lg text-gray-800 mt-3">
                Masuk ke Akun Anda
            </p>

            <p className="text-sm text-gray-500 mt-1">
                Selamat datang kembali! Silakan masuk 
                untuk melanjutkan.
            </p>
            </div>

            {/* Right side - Login Form (Responsive Container) */}
            <div className="bg-[#fafafa] border border-[#1E3A8A] rounded-xl shadow-sm max-w-md mx-auto w-full">
            {/* Inner container with responsive padding */}
            <div className="px-6 py-8 space-y-5">
                <h1 className="text-center underline font-extrabold text-2xl text-[#1E3A8A]">
                Masuk
                </h1>

                {/* Email Field */}
                <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">E-mail</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Mail size={16} className="text-gray-500 mr-2" />
                    <input
                    type="email"
                    placeholder="Masukkan email anda"
                    className="w-full text-sm focus:outline-none"
                    />
                </div>
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Lock size={16} className="text-gray-500 mr-2" />
                    <input
                    type="password"
                    placeholder="Masukkan password anda"
                    className="w-full text-sm focus:outline-none"
                    />
                </div>
                </div>

                {/* Links */}
                <div className="flex justify-between text-xs pt-">
                <a href="#" className="text-[#1E3A8A] font-semibold hover:underline">
                    Lupa password?
                </a>
                <span className="text-gray-600 font-semibold">
                    Belum punya akun?{" "}
                    <a href="#" className="text-[#1E3A8A] hover:underline font-semibold"
                            onClick={() => navigate("/signup")}>
                    Daftar
                    </a>
                </span>
                </div>

                {/* Submit Button */}
                <button className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[#162e68] transition font-medium"
                        onClick={() => navigate("/dashboard")}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="white"
                    className="w-5 h-5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h13m0 0l-4-4m4 4l-4 4" />
                </svg>
                Masuk
                </button>
            </div>
            </div>
        </div>
        </div>
        </Background>
        </>
    );
    }