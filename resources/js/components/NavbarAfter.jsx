// src/components/NavbarAfter.js
import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, MessageCircle, Heart, User, Tag, Pencil, ShoppingCart, AlertCircle } from "lucide-react";
import { useAuth } from "./context/AuthContext";
import { useNotification } from "./context/NotificationContext";

export default function NavbarAfter() {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const {logout}=useAuth();
  const { notifications, unreadCount, markAsRead } = useNotification();

  // Helper function to get icon based on notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'chat':
        return <MessageCircle size={18} className="text-green-600" />;
      case 'like':
        return <Heart size={18} className="text-red-500" />;
      case 'offer':
        return <Tag size={18} className="text-blue-500" />;
      case 'transaction':
        return <ShoppingCart size={18} className="text-purple-500" />;
      case 'system':
        return <AlertCircle size={18} className="text-orange-500" />;
      default:
        return <Pencil size={18} className="text-gray-500" />;
    }
  };

  // Helper function to format relative time
  const formatRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} detik lalu`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit lalu`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari lalu`;
    return date.toLocaleDateString('id-ID');
  };

  const handleNotificationClick = async (link, id) => {
    setIsNotificationOpen(false);
    await markAsRead(id);
    navigate(link || "/");
  };

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
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
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
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-0 ${
                          !notif.is_read ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleNotificationClick(notif.link, notif.id)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 relative`}>
                            {getNotificationIcon(notif.type)}
                            {/* ✅ Titik merah kecil jika belum dibaca */}
                            {!notif.is_read && (
                              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                            )}
                          </div>
                          <div className="flex-1">
                            {notif.title && (
                              <p className="text-xs font-medium text-gray-500 mb-1">{notif.title}</p>
                            )}
                            <p className={`text-sm ${!notif.is_read ? "font-medium" : ""}`}>
                              {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(notif.created_at)}</p>
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