    // components/SignupPage.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import { User, Phone, MapPin, Mail, Lock, Eye, EyeOff } from "lucide-react";
    import Background from "./Background";

    export default function SignupPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        nama: "",
        telepon: "",
        lokasi: "",
        email: "",
        password: "",
        konfirmasiPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (!formData.nama || !formData.telepon || !formData.lokasi) {
        setError("Semua field di langkah 1 wajib diisi!");
        return;
        }
        setStep(2);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password || !formData.konfirmasiPassword) {
        setError("Semua field di langkah 2 wajib diisi!");
        return;
        }
        if (formData.password !== formData.konfirmasiPassword) {
        setError("Password dan konfirmasi password harus sama!");
        return;
        }
        if (formData.password.length < 6) {
        setError("Password minimal 6 karakter!");
        return;
        }

        setIsLoading(true);
        setError("");

        try {
            // Pastikan URL ini sesuai dengan port Laravel Anda (biasanya 8000)
            const response = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({
                    name: formData.nama,
                    email: formData.email,
                    password: formData.password,
                    password_confirmation: formData.konfirmasiPassword,
                    phone: formData.telepon,
                    location: formData.lokasi,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Menangani error validasi dari Laravel
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0][0];
                    throw new Error(firstError);
                }
                throw new Error(data.message || "Terjadi kesalahan saat mendaftar");
            }

            alert("Pendaftaran berhasil! Silakan login.");
            navigate("/login");
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <Background>
            <div className="min-h-screen flex justify-center items-center px-4 py-8">
            <div className="grid md:grid-cols-2 gap-10 items-center max-w-7xl w-full">
                
                <div className="text-center md:text-center px-8">

                <h1 className="text-2xl font-bold whitespace-pre-line text-[#1E3A8A] mt-4">
                    ARTA MARKETPLACE
                </h1>

                <p className="font-bold text-lg text-gray-800 mt-3">
                    Buat Akun Baru
                </p>

                <p className="text-sm text-gray-500 mt-1">
                    Daftar sekarang dan mulai jual beli Anda!
                </p>
                </div>

                <div className="bg-[#fafafa] rounded-xl shadow-sm max-w-md mx-auto w-full">
                <div className="px-6 py-8 space-y-5">
                    <h1 className="text-center font-extrabold underline text-2xl text-[#1E3A8A]">
                    {step === 1 ? "Daftar" : "Daftar"}
                    </h1>

                    {error && (
                    <div className="p-2 bg-red-50 text-red-700 text-xs rounded-lg text-center">
                        {error}
                    </div>
                    )}

                    {step === 1 ? (
                    <form onSubmit={handleNext}>
                        <div className="space-y-1 mb-4">
                        <label className="block text-xs font-semibold text-gray-700">Nama Lengkap</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <User size={16} className="text-gray-500 mr-2" />
                            <input
                            type="text"
                            name="nama"
                            value={formData.nama}
                            onChange={handleChange}
                            placeholder="Masukkan nama lengkap anda"
                            className="w-full text-sm focus:outline-none"
                            required
                            />
                        </div>
                        </div>

                        <div className="space-y-1 mb-4">
                        <label className="block text-xs font-semibold text-gray-700">No. Telepon</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <Phone size={16} className="text-gray-500 mr-2" />
                            <input
                            type="tel"
                            name="telepon"
                            value={formData.telepon}
                            onChange={handleChange}
                            placeholder="0812-3456-7890"
                            className="w-full text-sm focus:outline-none"
                            required
                            />
                        </div>
                        </div>

                        <div className="space-y-1 mb-6">
                        <label className="block text-xs font-semibold text-gray-700">Lokasi Saat Ini</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <MapPin size={16} className="text-gray-500 mr-2" />
                            <input
                            type="text"
                            name="lokasi"
                            value={formData.lokasi}
                            onChange={handleChange}
                            placeholder="Kota/Kabupaten"
                            className="w-full text-sm focus:outline-none"
                            required
                            />
                        </div>
                        </div>

                        <div className="text-left text-xs mt-6 mb-4 pt-1 pb-1">
                        <span className="text-gray-600 font-semibold">
                            Sudah punya akun?{" "}
                            <button 
                            onClick={() => navigate("/login")}
                            className="text-[#1E3A8A] hover:underline font-semibold"
                            >
                            Masuk di sini
                            </button>
                        </span>
                        </div>

                        <button
                        type="submit"
                        className="w-full bg-[#1E3A8A] text-white py-3 rounded-lg flex justify-center items-center gap-2 hover:bg-[#162e68] transition font-medium"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="white"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                        Selanjutnya
                        </button>
                    </form>
                    ) : (
                    <form onSubmit={handleRegister}>
                        <div className="space-y-1 mb-4">
                        <label className="block text-xs font-semibold text-gray-700">Email</label>
                        <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                            <Mail size={16} className="text-gray-500 mr-2" />
                            <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Masukkan email anda"
                            className="w-full text-sm focus:outline-none"
                            required
                            />
                        </div>
                        </div>

                        <div className="space-y-1 mb-4">
                        <label className="block text-xs font-semibold text-gray-700">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-500 mr-2" />
                            </div>
                            <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Minimal 6 karakter"
                            className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                            required
                            />
                            <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? (
                                <EyeOff size={16} className="text-gray-500" />
                            ) : (
                                <Eye size={16} className="text-gray-500" />
                            )}
                            </button>
                        </div>
                        </div>

                        <div className="space-y-1 mb-6">
                        <label className="block text-xs font-semibold text-gray-700">Konfirmasi Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={16} className="text-gray-500 mr-2" />
                            </div>
                            <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="konfirmasiPassword"
                            value={formData.konfirmasiPassword}
                            onChange={handleChange}
                            placeholder="Ulangi password anda"
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

                        <div className="text-left text-xs mt-6 mb-4 pt-1 pb-1">
                        <span className="text-gray-600 font-semibold">
                            Sudah punya akun?{" "}
                            <button 
                            onClick={() => navigate("/login")}
                            className="text-[#1E3A8A] hover:underline font-semibold"
                            >
                            Masuk di sini
                            </button>
                        </span>
                        </div>

                        <div className="flex gap-3">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setStep(1)}
                            className="flex-1 border border-[#1E3A8A] text-[#1E3A8A] py-3 rounded-lg hover:bg-[#1E3A8A] hover:text-white transition font-medium"
                        >
                            Kembali
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 bg-[#1E3A8A] text-white py-3 rounded-lg hover:bg-[#162e68] transition font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? "Memproses..." : "Daftar"}
                        </button>
                        </div>
                    </form>
                    )}
                </div>
                </div>
            </div>
            </div>
        </Background>
        </>
    );
    }