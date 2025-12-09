    import React from "react";
    import { useNavigate } from "react-router-dom";
    import { User, Mail, Lock } from "lucide-react";
    import Background from "./Background"

    export default function SignupPage() {
        const navigate = useNavigate();
    return (
        <>
        <Background>
        <div className=" min-h-screen flex justify-center items-center px-4 py-8">
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
                Buat Akun Baru
            </p>

            <p className="text-sm text-gray-500 mt-1">
                Daftar sekarang dan mulai jual beli Anda!
            </p>
            </div>

            {/* Right side - Signup Form */}
            <div className="bg-[#fafafa] border border-[#1E3A8A] rounded-xl shadow-sm max-w-md mx-auto w-full">
            <div className="px-6 py-8 space-y-5">
                <h1 className="text-center font-extrabold underline text-2xl text-[#1E3A8A]">
                Daftar
                </h1>

                {/* Nama Lengkap */}
                <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Nama Lengkap</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <User size={16} className="text-gray-500 mr-2" />
                    <input
                    type="text"
                    placeholder="Masukkan nama lengkap anda"
                    className="w-full text-sm focus:outline-none"
                    />
                </div>
                </div>

                {/* Email */}
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

                {/* Password */}
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

                {/* Konfirmasi Password */}
                <div className="space-y-1">
                <label className="block text-xs font-semibold text-gray-700">Konfirmasi Password</label>
                <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                    <Lock size={16} className="text-gray-500 mr-2" />
                    <input
                    type="password"
                    placeholder="Konfirmasi password anda"
                    className="w-full text-sm focus:outline-none"
                    />
                </div>
                </div>

                {/* Links */}
                <div className="flex justify-between text-xs pt-1">
                <span className="text-gray-600 font-semibold">
                    Sudah punya akun?{" "}
                    <a href="#" className="text-[#1E3A8A] hover:underline font-semibold"
                        onClick={() => navigate("/login")}>
                    Masuk
                    </a>
                </span>
                </div>

                {/* Submit Button */}
                <button className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[#162e68] transition font-medium"
                    onClick={() => navigate("/login")}>
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
                Daftar
                </button>
            </div>
            </div>
        </div>
        </div>
        </Background>
        </>
    );
    }