// resources/js/components/ResetPasswordPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff } from "lucide-react";
import Background from "./Background";
import { useAuth } from "./context/AuthContext";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (!token || !email) {
      navigate('/login');
    }
  }, [token, email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setMessage({ type: "error", text: "Password tidak cocok" });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ 
          type: "success", 
          text: "Password berhasil direset. Silakan login dengan password baru." 
        });
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        setMessage({ 
          type: "error", 
          text: result.message 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        text: "Terjadi kesalahan server" 
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
            
            <div className="text-center md:text-center px-8">
              <h1 className="text-2xl font-bold text-[#1E3A8A] mt-4">
                ARTA MARKETPLACE
              </h1>
              <p className="font-bold text-lg text-gray-800 mt-3">
                Reset Password
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Masukkan password baru Anda
              </p>
            </div>

            <div className="bg-[#fafafa] rounded-xl shadow-sm max-w-md mx-auto w-full">
              <div className="px-6 py-8 space-y-5">
                <h1 className="text-center underline font-extrabold text-2xl text-[#1E3A8A]">
                  Reset Password
                </h1>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-1 mb-4">
                    <label className="block text-xs font-semibold text-gray-700">Password Baru</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-500" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukkan password baru"
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

                  <div className="space-y-1 mb-4">
                    <label className="block text-xs font-semibold text-gray-700">Konfirmasi Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-500" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Konfirmasi password baru"
                        className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {message.text && (
                    <div className={`rounded-md p-3 text-xs ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {message.text}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[#162e68] transition font-medium mt-6"
                  >
                    {loading ? "Memproses..." : "Reset Password"}
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
