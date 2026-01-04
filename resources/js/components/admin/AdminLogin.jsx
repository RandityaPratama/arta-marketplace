import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Mail, Eye, EyeOff, Lock } from "lucide-react";
import Background from "../Background";
import { useAdminAuth } from "./admincontext/AdminAuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminLogin, authError, loading } = useAdminAuth();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);  
  const [isSubmitting, setIsSubmitting] = useState(false);

 const handleLogin = async (e) => {
    e.preventDefault();
        
    const result = await adminLogin({ email, password });
    
    if (result.success) {
      navigate("/admin/dashboard", { replace: true });
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
          </div>

          <form onSubmit={handleLogin}>
           {authError && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {authError}
          </div>
        )}

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email Admin</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="admin@mail.com"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1E3A8A] text-white py-2.5 rounded-lg hover:bg-[#162e68] transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? "Memproses..." : "Masuk ke Admin"}
            </button>
          </form>
        </div>
      </div>
    </Background>
  );
}