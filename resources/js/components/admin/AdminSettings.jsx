    // components/admin/AdminSettings.jsx
    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button";
    import { useAdminSetting } from "./admincontext/AdminSettingContext";

    export default function AdminSettings() {
    const navigate = useNavigate();
    const { 
        categories, 
        reportReasons, 
        fetchSettings, 
        addCategory, 
        deleteCategory, 
        addReportReason, 
        deleteReportReason,
        loading 
    } = useAdminSetting();

    // State lokal untuk input baru
    const [newCategory, setNewCategory] = useState("");
    const [newReason, setNewReason] = useState("");

    useEffect(() => {
        fetchSettings();
    }, [fetchSettings]);

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        const result = await addCategory(newCategory);
        if (result.success) setNewCategory("");
        else alert(result.message);
    };

    const handleAddReason = async () => {
        if (!newReason.trim()) return;
        const result = await addReportReason(newReason);
        if (result.success) setNewReason("");
        else alert(result.message);
    };

    const handleDelete = async (type, id) => {
        if (!confirm("Yakin ingin menghapus data ini?")) return;
        if (type === 'category') await deleteCategory(id);
        if (type === 'reason') await deleteReportReason(id);
    };

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
            </div>
            <div className="space-y-3">
                {/* List Kategori */}
                {categories.map((category) => (
                <div key={category.id} className="flex gap-2 items-center">
                    <div className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-700">
                        {category.name}
                    </div>
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete('category', category.id)}
                    className="px-3"
                    >
                    Hapus
                    </Button>
                </div>
                ))}

                {/* Input Tambah Kategori */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Tambah kategori baru..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button variant="primary" size="sm" onClick={handleAddCategory} disabled={loading}>
                        + Tambah
                    </Button>
                </div>

                {categories.length === 0 && !loading && (
                <p className="text-gray-500 text-sm">Belum ada kategori.</p>
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
            </div>
            <div className="space-y-3">
                {/* List Alasan */}
                {reportReasons.map((reason) => (
                <div key={reason.id} className="flex gap-2 items-center">
                    <div className="flex-1 px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-700">
                        {reason.reason}
                    </div>
                    <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete('reason', reason.id)}
                    className="px-3"
                    >
                    Hapus
                    </Button>
                </div>
                ))}

                {/* Input Tambah Alasan */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <input
                        type="text"
                        value={newReason}
                        onChange={(e) => setNewReason(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Tambah alasan laporan baru..."
                        onKeyDown={(e) => e.key === 'Enter' && handleAddReason()}
                    />
                    <Button variant="primary" size="sm" onClick={handleAddReason} disabled={loading}>
                        + Tambah
                    </Button>
                </div>
            </div>
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