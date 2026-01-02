// src/components/NavbarAfter.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, MessageCircle, Heart, User, Tag, Pencil } from "lucide-react";
import { useAuth } from "./context/AuthContext";

export default function NavbarAfter() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const {logout}=useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
  await logout();
  };


  // ✅ Data notifikasi sesuai gambar Anda
  const notifications = [
    {
      id: 1,
      message: "Randitya mengirim pesan baru",
      time: "2 menit lalu",
      icon: <MessageCircle size={18} className="text-green-600" />,
      read: false, // Belum dibaca → background biru muda + titik merah
      type: "chat"
    },
    {
      id: 2,
      message: "Produk Anda disukai oleh 3 orang",
      time: "1 jam lalu",
      icon: <Heart size={18} className="text-red-500" />,
      read: true,
      type: "like"
    },
    {
      id: 3,
      message: "Produk Anda terjual!",
      time: "2 hari lalu",
      icon: <Tag size={18} className="text-blue-500" />,
      read: true,
      type: "sale"
    },
    {
      id: 4,
      message: "Pembaruan fitur chat tersedia!",
      time: "3 hari lalu",
      icon: <Pencil size={18} className="text-orange-500" />,
      read: true,
      type: "update"
    },
    {
      id: 5,
      message: "Budi menawar produk Anda",
      time: "1 hari lalu",
      icon: <MessageCircle size={18} className="text-green-600" />,
      read: false,
      type: "offer"
    },
  ];

  return (
    <nav className="bg-[#1E3A8A] text-white font-[Poppins] py-3">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span 
            onClick={() => navigate("/dashboard")}
            className="font-bold text-[#FED7AA] text-xl tracking-tight cursor-default"
          >
            ARTA MARKETPLACE
          </span>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3">
          {/* Favorit */}
          <button
            onClick={() => navigate("/favorite")}
            className="p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Favorit"
          >
            <Heart size={20} className="text-white" strokeWidth={1.8} />
          </button>

          {/* Chat */}
          <button
            onClick={() => navigate("/chat")}
            className="p-2 rounded-full hover:bg-white/10 transition"
            aria-label="Chat"
          >
            <MessageCircle size={20} className="text-white" strokeWidth={1.8} />
          </button>

          {/* ✅ Notifikasi Dropdown - DENGAN TITIK MERAH UNTUK BELUM DIBACA */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition relative"
              aria-label="Notifikasi"
            >
              <Bell size={20} className="text-white" strokeWidth={1.8} />
              {/* ✅ Badge jumlah belum dibaca */}
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
              )}
            </button>

            {isNotificationOpen && (
              <div className="absolute right-0 mt-2 w-96 bg-white text-gray-800 rounded-lg shadow-lg z-50 border border-gray-200">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                </div>
                
                {/* ✅ Daftar Notifikasi - BISA DI-SCROLL */}
                <div className="max-h-60 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      Tidak ada notifikasi baru.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 ${
                          !notif.read ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            !notif.read ? "bg-gray-100" : "bg-gray-100"
                          } relative`}>
                            {notif.icon}
                            {/* ✅ Titik merah kecil jika belum dibaca */}
                            {!notif.read && (
                              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${!notif.read ? "font-medium" : ""}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* ✅ "Lihat Semua" - TETAP DI BAWAH (TIDAK DI-SCROLL) */}
                <div className="px-4 py-2.5 border-t border-gray-200">
                  <button 
                    className="w-full text-[#1E3A8A] text-sm font-medium hover:underline text-center"
                    onClick={() => { setIsNotificationOpen(false); navigate("/notif"); }}
                  >
                    Lihat Semua
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profil Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-2 rounded-full hover:bg-white/10 transition"
              aria-label="Profil"
            >
              <User size={20} className="text-white" strokeWidth={1.8} />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white text-[#1E3A8A] rounded-lg shadow-lg py-2 z-50 border border-gray-100">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  <User size={16} strokeWidth={1.8} />
                  Cek Profil
                </Link>
                <Link
                  to="/history"
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h17.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125H3.375c-.621 0-1.125-.504-1.125-1.125V7.125z" />
                  </svg>
                  Riwayat Pembelian
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-gray-50"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9v3.75m0 0v3.75m0-3.75h3.75M12 15.75m0 0v3.75m0-3.75H8.25" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/sell")}
            className="px-4 py-2 bg-white text-[#1E3A8A] rounded-md font-medium text-sm hover:bg-gray-100 transition"
          >
            Jual
          </button>
        </div>
      </div>
    </nav>
  );
}