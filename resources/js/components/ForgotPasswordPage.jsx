// components/ForgotPasswordPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";
import Background from "./Background";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Email tidak valid" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // ✅ Ganti dengan API reset password-mu
      // const response = await api.post('/auth/forgot-password', { email });
      
      // Simulasi API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setMessage({ 
        type: "success", 
        text: "Link reset password telah dikirim ke email Anda" 
      });
      
      // Redirect ke login setelah 3 detik
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Email tidak ditemukan atau gagal mengirim email" 
      });
    } finally {
      setLoading(false);
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
                Lupa Password?
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan email Anda dan kami akan mengirimkan link untuk reset password
              </p>
            </div>

            {/* Right side - Forgot Password Form */}
            <div className="bg-[#fafafa] rounded-xl shadow-sm max-w-md mx-auto w-full">
              <div className="px-6 py-8 space-y-5">
                <h1 className="text-center underline font-extrabold text-2xl text-[#1E3A8A]">
                  Lupa Password
                </h1>

                <form onSubmit={handleSubmit}>
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

                  {/* Message Feedback */}
                  {message.text && (
                    <div className={`rounded-md p-3 text-xs ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {message.text}
                    </div>
                  )}

                  {/* ✅ LINK "KEMBALI KE LOGIN" DI SEBELAH KIRI */}
                  <div className="text-left mt-2">
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="text-[#1E3A8A] font-semibold text-xs hover:underline"
                    >
                      Kembali ke login
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[#162e68] transition font-medium mt-6"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
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
                    )}
                    {loading ? "Mengirim..." : "Kirim Link Reset"}
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