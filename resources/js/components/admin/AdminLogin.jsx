    // components/admin/AdminLogin.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { LogIn, Mail, Eye, EyeOff, Lock } from "lucide-react";
    import Background from "../Background";

    export default function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // ✅ State toggle
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

       try{
        const response= await fetch("http://127.0.0.1:8000/admin/login",{
            method:"POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
        } )

        const data=await response.json();

        if(!response.ok){
             throw new Error(data.message||"Login gagal silahkan cek email dan password anda");
        };

        if(data.token){localStorage.setItem("token",data.token)};
        if(data.admin){localStorage.setItem("admin",JSON.stringify(data,admin))}

        navigate("/admin/dashboard");
       }catch(err){
        setError(err.message);
       }finally{
        setIsLoading(false);
       }
    };

    return (
        <Background>
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border border-gray-200">
            <div className="text-center mb-8">
                <div className="mx-auto w-12 h-12 bg-[#1E3A8A] rounded-lg flex items-center justify-center mb-4">
                <LogIn className="text-white" size={24} />
                </div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
                <p className="text-gray-600 text-sm mt-1">
                Masuk ke dashboard administrasi
                </p>
            </div>

            <form onSubmit={handleLogin}>
                {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">
                    {error}
                </div>
                )}

                {/* Email */}
                <div className="mb-4">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Email Admin
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-500" />
                    </div>
                    <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Masukan email admin"
                    />
                </div>
                </div>

                {/* Password - ✅ DIPERBAIKI */}
                <div className="mb-6">
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                    Password
                </label>
                <div className="relative">
                    {/* Ikon Lock di kiri */}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-500" />
                    </div>
                    
                    {/* Input Password */}
                    <input
                    type={showPassword ? "text" : "password"} // ✅ KUNCI: Ganti tipe dinamis
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="••••••••"
                    />
                    
                    {/* ✅ Tombol Toggle di KANAN */}
                    <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)} // ✅ Toggle state
                    >
                    {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                    )}
                    </button>
                </div>
                </div>

                <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-[#1E3A8A] text-white py-2.5 rounded-lg hover:bg-[#162e68] transition font-medium flex items-center justify-center gap-2 ${
                    isLoading ? "opacity-75 cursor-not-allowed" : ""
                }`}
                >
                {isLoading ? (
                    <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                    </>
                ) : (
                    <>
                    <LogIn size={18} />
                    Masuk ke Admin
                    </>
                )}
                </button>
            </form>

            <div className="mt-6 text-center text-xs text-gray-500">
                <p>RARENSELL • Panel Administrasi</p>
            </div>
            </div>
        </div>
        </Background>
    );
    }