    // src/pages/NotificationPage.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background";

    export default function NotificationPage() {
    const navigate = useNavigate();

    // ✅ Data dummy notifikasi (simpan di state agar bisa diubah status "read")
    const [notifications, setNotifications] = useState([
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
        read: false,
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
        },
        {
        id: 5,
        type: "message",
        message: "Budi menawar produk Anda",
        time: "1 hari lalu",
        read: false,
        link: "/chat/2"
        }
    ]);

    // ✅ Tandai semua sebagai sudah dibaca
    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    // ✅ Tandai satu notifikasi sebagai sudah dibaca
    const markAsRead = (id) => {
        setNotifications(notifications.map(n => 
        n.id === id ? { ...n, read: true } : n
        ));
    };

    // ✅ Handle klik notifikasi
    const handleNotificationClick = (link, id) => {
        markAsRead(id);
        navigate(link);
    };

    // ✅ Hitung notifikasi belum dibaca
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
                        {/* Ikon Jenis Notifikasi */}
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        notif.type === "message" ? "bg-[#D5F0DD]" :
                        notif.type === "favorite" ? "bg-[#f3cbcb]" :
                        notif.type === "sold" ? "bg-[#DDE7FF]" : "bg-[#FED7AA]"
                        }`}>
                        {notif.type === "message" && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#1E3A8A" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                            </svg>
                        )}
                        {notif.type === "favorite" && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#1E3A8A" className="w-5 h-5">
                            <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        )}
                        {notif.type === "sold" && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#1E3A8A" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75l1.5-1.5m1.5-1.5l1.5 1.5M9 4.5l6 6m-6 6l6-6m-6 6h12m-12 0V3m12 18V9" />
                            </svg>
                        )}
                        {notif.type === "system" && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#1E3A8A" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l-2.55-2.55m5.337-2.551l-2.55 2.55" />
                            </svg>
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