    import React, { useState, useRef, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import { Bell, MessageCircle, Heart, User } from "lucide-react";

    export default function NavbarAfter() {
    const navigate = useNavigate();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false); // ✅ State baru
    
    const profileRef = useRef(null);
    const notificationRef = useRef(null); // ✅ Ref untuk notifikasi

    // ✅ Tutup dropdown saat klik di luar
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

    // ✅ Data dummy notifikasi
    const notifications = [
        {
        id: 1,
        type: "message",
        message: "Randitya mengirim pesan baru",
        time: "2 menit lalu",
        read: false,
        link: "/chat/1"
        },
        {
        id: 2,
        type: "favorite",
        message: "Produk Anda disukai oleh 3 orang",
        time: "1 jam lalu",
        read: true,
        link: "/favorite"
        },
        {
        id: 3,
        type: "sold",
        message: "Produk Anda terjual!",
        time: "2 hari lalu",
        read: true,
        link: "/profile"
        },
        {
        id: 4,
        type: "system",
        message: "Pembaruan fitur chat tersedia!",
        time: "3 hari lalu",
        read: true,
        link: "/"
        }
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    // ✅ Handler klik notifikasi
    const handleNotificationClick = (link) => {
        navigate(link);
        setIsNotificationOpen(false);
    };

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
            <span 
                className="font-bold text-[#FED7AA] text-xl tracking-tight cursor-pointer"
                onClick={() => navigate("/dashboard")}
            >
                ARTA MARKETPLACE
            </span>
            </div>

            {/* Right: Icons */}
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

            {/* Notifikasi — DENGAN DROPDOWN */}
            <div className="relative" ref={notificationRef}>
                <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-full hover:bg-white/10 transition relative"
                aria-label="Notifikasi"
                >
                <Bell size={20} className="text-white" strokeWidth={1.8} />
                {/* Badge unread */}
                {notifications.some(n => !n.read) && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-400 rounded-full"></span>
                )}
                </button>

                {/* ✅ Dropdown Notifikasi */}
                {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-100 max-h-96 overflow-y-auto">
                    <div className="px-4 py-2 border-b border-gray-200">
                    <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                    </div>
                    <div>
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-4">Tidak ada notifikasi</p>
                    ) : (
                        notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            !notif.read ? "bg-blue-50" : ""
                            }`}
                            onClick={() => handleNotificationClick(notif.link)}
                        >
                            <p className={`text-sm ${!notif.read ? "font-medium" : "text-gray-700"}`}>
                            {notif.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                        ))
                    )}
                    </div>
                    <div className="px-4 py-2 text-center">
                    <button
                        className="text-[#1E3A8A] text-sm font-medium hover:underline"
                        onClick={() => navigate("/notif")}
                    >
                        Lihat Semua
                    </button>
                    </div>
                </div>
                )}
            </div>

            {/* Profil */}
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
                    <button
                    onClick={() => {
                        navigate("/profile");
                        setIsProfileOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                    <User size={16} strokeWidth={1.8} />
                    Cek Profil
                    </button>
                    <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-gray-50"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="currentColor"
                        className="w-4 h-4"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9v3.75m0 0v3.75m0-3.75h3.75M12 15.75m0 0v3.75m0-3.75H8.25"
                        />
                    </svg>
                    Logout
                    </button>
                </div>
                )}
            </div>

            {/* Tombol "Jual" */}
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