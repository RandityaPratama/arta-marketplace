// components/LoginPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import Background from "./Background";
import { useAuth } from "./context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); 
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {

      const result = await login({ email, password });
            
      if (!result.success) {
        throw new Error(result.message || "Login gagal. Periksa email dan password Anda.");
      }
            
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Background>
        <div className="font-[Poppins] min-h-screen flex justify-center items-center px-4 py-8">
          <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl w-full">
            
            {/* Left side - Branding */}
            <div className="text-center md:text-center px-8">
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

            {/* Right side - Login Form */}
            <div className="bg-[#fafafa] rounded-xl shadow-sm max-w-md mx-auto w-full">
              <div className="px-6 py-8 space-y-5">
                <h1 className="text-center underline font-extrabold text-2xl text-[#1E3A8A]">
                  Masuk
                </h1>

                {error && (
                  <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg text-center">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin}>
                  {/* Email Field */}
                  <div className="space-y-1 mb-4">
                    <label className="block text-xs font-semibold text-gray-700">E-mail</label>
                    <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukkan email anda"
                        className="w-full text-sm focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1 mb-4">
                    <label className="block text-xs font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-500 mr-2" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password anda"
                        className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex justify-between text-xs mt-2">
                    <a 
                      href="#" 
                      className="text-[#1E3A8A] font-semibold hover:underline" 
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/forgot");
                      }}
                    >
                      Lupa password?
                    </a>
                    <span className="text-gray-600 font-semibold">
                      Belum punya akun?{" "}
                      <a 
                        href="#" 
                        className="text-[#1E3A8A] hover:underline font-semibold"
                        onClick={(e) => {
                          e.preventDefault();
                          navigate("/signup");
                        }}
                      >
                        Daftar
                      </a>
                    </span>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full bg-[#1E3A8A] text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[#162e68] transition font-medium mt-6 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? "Memproses..." : (
                      <>
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
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Background>
    </>
  );
}