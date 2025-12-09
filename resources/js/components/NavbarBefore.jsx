    import React from "react";
    import { useNavigate } from "react-router-dom";

    export default function NavbarBefore() {
    const navigate = useNavigate();

    return (
        <nav className="bg-[#1E3A8A] text-white font-[Poppins] py-3">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
            {/* Left: Logo */}
            <div className="flex items-center gap-3">
            <div className="bg-[#FED7AA] p-2 rounded-lg">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
                stroke="white"
                className="w-6 h-6"
                >
                <path d="M3 7h18M5 7l1 12h12l1-12M8 7V4h8v3" />
                </svg>
            </div>
            <span className="font-bold text-[#FED7AA] text-xl tracking-tight">ARTA MARKETPLACE</span>
            </div>

            {/* Right: Login & Daftar */}
            <div className="flex items-center gap-3">
            <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 border border-white text-white rounded-md font-medium text-sm hover:bg-white/10 transition"
            >
                Login
            </button>
            <button
                onClick={() => navigate("/signup")}
                className="px-4 py-2 bg-white text-[#1E3A8A] rounded-md font-medium text-sm hover:bg-gray-100 transition"
            >
                Daftar
            </button>
            </div>
        </div>
        </nav>
    );
    }