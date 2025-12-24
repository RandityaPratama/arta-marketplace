    // components/admin/AdminActivity.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button";

    export default function AdminActivity() {
    const navigate = useNavigate();

    const [activities] = useState([
        { id: 1, action: "Randitya mengunggah produk baru", time: "2 jam lalu", type: "produk" },
        { id: 2, action: "Budi membeli Samsung S24 Ultra", time: "5 jam lalu", type: "transaksi" },
        { id: 3, action: "Dina memperbarui profil", time: "1 hari lalu", type: "profil" },
        { id: 5, action: "Andi menghapus iklan", time: "2 hari lalu", type: "produk" },
        { id: 6, action: "Siti mendaftar sebagai pengguna baru", time: "2 hari lalu", type: "pengguna" },
        { id: 7, action: "Budi menghubungi penjual", time: "3 hari lalu", type: "chat" },
        { id: 8, action: "Randitya melaporkan iklan", time: "3 hari lalu", type: "laporan" },
        { id: 9, action: "Admin menyetujui produk Samsung S24", time: "4 hari lalu", type: "admin" },
        { id: 10, action: "Admin memblokir pengguna curang", time: "5 hari lalu", type: "admin" },
    ]);

    const [filter, setFilter] = useState("semua");

    const filteredActivities = filter === "semua" 
        ? activities 
        : activities.filter(a => a.type === filter);

    const getActivityColor = (type) => {
        switch (type) {
        case "produk": return "bg-blue-100 text-blue-800";
        case "transaksi": return "bg-green-100 text-green-800";
        case "profil": return "bg-purple-100 text-purple-800";
        case "pengguna": return "bg-indigo-100 text-indigo-800";
        case "chat": return "bg-pink-100 text-pink-800";
        case "laporan": return "bg-red-100 text-red-800";
        case "admin": return "bg-gray-100 text-gray-800";
        default: return "bg-gray-100 text-gray-800";
        }
    };

    const getActivityLabel = (type) => {
        switch (type) {
        case "produk": return "Produk";
        case "transaksi": return "Transaksi";
        case "profil": return "Profil";
        case "pengguna": return "Pengguna";
        case "chat": return "Chat";
        case "laporan": return "Laporan";
        case "admin": return "Admin";
        default: return "Lainnya";
        }
    };

    return (
        <AdminLayout>
        {/* ✅ Container scrollable tanpa scrollbar */}
        <div 
            className="overflow-y-auto h-full"
            style={{
            scrollbarWidth: 'none',     /* Firefox */
            msOverflowStyle: 'none'     /* IE 10+ */
            }}
        >
            <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                <h2 className="text-2xl font-bold text-gray-800">Aktivitas Terbaru</h2>
                <p className="text-sm text-gray-600 mt-1">
                    {activities.length} aktivitas ditemukan
                </p>
                </div>
                <Button variant="primary" size="md" onClick={() => navigate(-1)}>
                Kembali
                </Button>
            </div>

            {/* Filter */}
            <div className="flex flex-wrap gap-2 mb-6">
                {[
                { id: "semua", label: "Semua" },
                { id: "produk", label: "Produk" },
                { id: "transaksi", label: "Transaksi" },
                { id: "profil", label: "Profil" },
                { id: "pengguna", label: "Pengguna" },
                { id: "chat", label: "Chat" },
                { id: "laporan", label: "Laporan" },
                { id: "admin", label: "Admin" },
                ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setFilter(item.id)}
                    className={`px-3 py-1.5 text-sm rounded-full min-w-[80px] flex items-center justify-center ${
                    filter === item.id
                        ? "bg-[#1E3A8A] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                    {item.label}
                </button>
                ))}
            </div>

            {/* Daftar Aktivitas */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                {filteredActivities.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    Tidak ada aktivitas yang sesuai filter.
                </div>
                ) : (
                <ul className="divide-y divide-gray-200">
                    {filteredActivities.map((activity) => (
                    <li key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                        <div className="flex items-start gap-4">
                        <span 
                            className={`w-[79px] px-2 py-1 rounded-full text-xs font-medium text-center ${getActivityColor(activity.type)}`}
                        >
                            {getActivityLabel(activity.type)}
                        </span>
                        <div className="flex-1">
                            <p className="text-gray-800">{activity.action}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                        </div>
                    </li>
                    ))}
                </ul>
                )}
            </div>
            </div>
        </div>

        {/* ✅ Sembunyikan scrollbar di WebKit (Chrome, Safari, Edge) */}
        <style jsx>{`
            ::-webkit-scrollbar {
            display: none;
            }
        `}</style>
        </AdminLayout>
    );
    }