    // components/NotificationPage.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background";
    import { MessageCircle, Heart, Tag, Pencil } from "lucide-react";

    export default function NotificationPage() {
    const navigate = useNavigate();

    // ✅ Data notifikasi sesuai dropdown
    const [notifications, setNotifications] = useState([
        {
        id: 1,
        message: "Randitya mengirim pesan baru",
        time: "2 menit lalu",
        icon: <MessageCircle size={18} className="text-green-600" />,
        read: false,
        link: "/chat/1"
        },
        {
        id: 2,
        message: "Produk Anda disukai oleh 3 orang",
        time: "1 jam lalu",
        icon: <Heart size={18} className="text-red-500" />,
        read: false,
        link: "/favorite"
        },
        {
        id: 3,
        message: "Produk Anda terjual!",
        time: "2 hari lalu",
        icon: <Tag size={18} className="text-blue-500" />,
        read: true,
        link: "/profile"
        },
        {
        id: 4,
        message: "Pembaruan fitur chat tersedia!",
        time: "3 hari lalu",
        icon: <Pencil size={18} className="text-orange-500" />,
        read: true,
        link: "/"
        },
        {
        id: 5,
        message: "Budi menawar produk Anda",
        time: "1 hari lalu",
        icon: <MessageCircle size={18} className="text-green-600" />,
        read: false,
        link: "/chat/2"
        }
    ]);

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleNotificationClick = (link, id) => {
        markAsRead(id);
        navigate(link);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
                {unreadCount > 0 && (
                    <p className="text-sm text-gray-600 mt-1">
                    {unreadCount} notifikasi belum dibaca
                    </p>
                )}
                </div>
                <Button
                variant="primary"
                size="md"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                >
                Tandai Semua Sudah Dibaca
                </Button>
            </div>

            {/* Daftar Notifikasi */}
            {notifications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7ff] rounded-full mb-4">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="#1E3A8A"
                    className="w-7 h-7"
                    >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-5.454l6.898-6.898c1.14-1.14 1.14-2.98 0-4.12a2.087 2.087 0 00-1.593-.69A21.035 21.035 0 003.762 12.265a21.035 21.035 0 0010.404 10.404 21.035 21.035 0 0010.404-10.404 21.035 21.035 0 00-10.404-10.404 21.035 21.035 0 00-10.404 10.404z" />
                    </svg>
                </div>
                <h3 className="text-[18px] font-[600] text-gray-800 mb-2">Tidak ada notifikasi</h3>
                <p className="text-[14px] text-gray-600">
                    Anda akan menerima notifikasi saat ada yang menghubungi atau menyukai produk Anda.
                </p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {notifications.map((notif) => (
                    <div
                    key={notif.id}
                    className={`p-5 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 ${
                        !notif.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notif.link, notif.id)}
                    >
                    <div className="flex items-start gap-3">
                        {/* ✅ Ikon dengan background dan titik merah */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        !notif.read ? "bg-gray-100" : "bg-gray-100"
                        } relative`}>
                        {notif.icon}
                        {/* ✅ Titik merah jika belum dibaca */}
                        {!notif.read && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                        </div>

                        {/* Konten */}
                        <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notif.read ? "font-medium" : "text-gray-700"}`}>
                            {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                        </div>
                    </div>
                    </div>
                ))}
                </div>
            )}
            </div>
        </Background>
        <Footer />
        </>
    );
    }