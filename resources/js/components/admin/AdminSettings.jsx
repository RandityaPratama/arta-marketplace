    // components/admin/AdminSettings.jsx
    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button";

    export default function AdminSettings() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState({
        siteName: "ARTA MARKETPLACE",
        productCategories: ["Elektronik", "Fashion", "Furnitur", "Hobi", "Rumah Tangga"],
        reportReasons: [
        "Harga tidak sesuai pasar",
        "Menjual barang palsu",
        "Postingan duplikat",
        "Menjual barang terlarang"
        ],
        // ❌ Hapus semua pengaturan notifikasi
    });

    useEffect(() => {
        const saved = localStorage.getItem("admin_settings");
        if (saved) {
        setSettings(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("admin_settings", JSON.stringify(settings));
    }, [settings]);

    const handleTextChange = (key, value) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const handleArrayChange = (key, index, value) => {
        const newArray = [...settings[key]];
        newArray[index] = value;
        setSettings(prev => ({ ...prev, [key]: newArray }));
    };

    const addArrayItem = (key) => {
        if (settings[key].length >= 10) {
        alert("Maksimal 10 kategori!");
        return;
        }
        setSettings(prev => ({ ...prev, [key]: [...prev[key], ""] }));
    };

    const removeArrayItem = (key, index) => {
        const newArray = settings[key].filter((_, i) => i !== index);
        setSettings(prev => ({ ...prev, [key]: newArray }));
    };

    // ❌ Hapus fungsi toggleNotification

    return (
        <AdminLayout>
        <div 
            className="overflow-y-auto p-6"
            style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
            }}
        >
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Pengaturan Platform</h2>
            <Button variant="primary" size="md" onClick={() => navigate("/admin")}>
                Kembali
            </Button>
            </div>

            {/* Kategori Produk */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Kategori Produk</h3>
                <Button
                variant="primary"
                size="sm"
                onClick={() => addArrayItem("productCategories")}
                >
                + Tambah
                </Button>
            </div>
            <div className="space-y-3">
                {settings.productCategories.map((category, index) => (
                <div key={index} className="flex gap-2">
                    <input
                    type="text"
                    value={category}
                    onChange={(e) => handleArrayChange("productCategories", index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Nama kategori"
                    />
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeArrayItem("productCategories", index)}
                    className="px-3"
                    >
                    Hapus
                    </Button>
                </div>
                ))}
                {settings.productCategories.length === 0 && (
                <p className="text-gray-500 text-sm">Belum ada kategori. Klik "+ Tambah" untuk membuat.</p>
                )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
                Maksimal 1,10 kategori. Kategori akan muncul di halaman jual pengguna.
            </p>
            </div>

            {/* Alasan Laporan */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Alasan Laporan</h3>
                <Button
                variant="primary"
                size="sm"
                onClick={() => addArrayItem("reportReasons")}
                >
                + Tambah
                </Button>
            </div>
            <div className="space-y-3">
                {settings.reportReasons.map((reason, index) => (
                <div key={index} className="flex gap-2">
                    <input
                    type="text"
                    value={reason}
                    onChange={(e) => handleArrayChange("reportReasons", index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Alasan laporan"
                    />
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeArrayItem("reportReasons", index)}
                    className="px-3"
                    >
                    Hapus
                    </Button>
                </div>
                ))}
            </div>
            </div>

            <div className="text-right">
            <Button
                variant="primary"
                size="md"
                onClick={() => alert("Pengaturan berhasil disimpan!")}
            >
                Simpan Perubahan
            </Button>
            </div>
        </div>

        <style jsx>{`
            ::-webkit-scrollbar {
            display: none;
            }
        `}</style>
        </AdminLayout>
    );
    }