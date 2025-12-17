    // src/pages/admin/AdminUserProfile.js
    import React, { useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button";

    export default function AdminUserProfile() {
    const navigate = useNavigate();
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("iklan");

    // ✅ Data dummy pengguna
    const mockUsers = [
        { id: 1, name: "Randitya Pratama", email: "randi@example.com", status: "Aktif", joined: "12 Jan 2025", phone: "+62 812-3456-7890", location: "Surabaya" },
        { id: 2, name: "Budi Santoso", email: "budi@example.com", status: "Aktif", joined: "3 Feb 2025", phone: "+62 813-8888-1111", location: "Jakarta" },
        { id: 3, name: "Dina Putri", email: "dina@example.com", status: "Diblokir", joined: "15 Mar 2025", phone: "+62 815-9999-2222", location: "Yogyakarta" },
        { id: 4, name: "Eko Wijaya", email: "eko@example.com", status: "Aktif", joined: "22 Apr 2025", phone: "+62 817-7777-3333", location: "Bandung" },
    ];

    // ✅ Data iklan (semua status)
    const mockListings = {
        1: [
        { id: 101, name: "Samsung S24 Ultra", category: "Elektronik", price: "12.000.000", status: "Aktif", publishedAt: "10 Des 2025" },
        { id: 102, name: "iPhone 15 Pro", category: "Elektronik", price: "15.500.000", status: "Menunggu", publishedAt: "12 Des 2025" },
        { id: 103, name: "Laptop ASUS", category: "Elektronik", price: "5.000.000", status: "Ditolak", publishedAt: "8 Des 2025" },
        ],
        3: [
        { id: 301, name: "Sepatu Nike KW", category: "Fashion", price: "500.000", status: "Ditolak", publishedAt: "5 Des 2025" },
        { id: 302, name: "Kursi Gaming", category: "Furnitur", price: "2.300.000", status: "Aktif", publishedAt: "7 Des 2025" },
        ],
    };

    // ✅ Data pembelian
    const mockPurchases = {
        1: [
        { id: 1001, productName: "Kursi Gaming", seller: "Andi Wijaya", price: "2.300.000", status: "Diterima", purchaseDate: "8 Des 2025" },
        ],
        2: [
        { id: 2001, productName: "Laptop ASUS", seller: "Dina Putri", price: "5.000.000", status: "Dikirim", purchaseDate: "10 Des 2025" },
        ],
        4: [
        { id: 4001, productName: "Adidas Adizero", seller: "Budi Santoso", price: "1.200.000", status: "Diterima", purchaseDate: "5 Des 2025" },
        ],
    };

    useEffect(() => {
        const foundUser = mockUsers.find(u => u.id === parseInt(userId));
        if (foundUser) {
        setUser(foundUser);
        } else {
        navigate("/admin/users");
        }
    }, [userId, navigate]);

    if (!user) return null;

    // ✅ Hanya tampilkan iklan dengan status "Aktif"
    const activeListings = (mockListings[userId] || []).filter(product => product.status === "Aktif");
    const currentPurchases = mockPurchases[userId] || [];

    return (
        <AdminLayout active="Pengguna">
        <div>
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Profil Pengguna</h2>
            <Button variant="primary" size="md" onClick={() => navigate("/admin/users")}>
                Kembali ke Daftar
            </Button>
            </div>

            {/* Info Pengguna (tanpa peran) */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informasi Pengguna</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <p className="text-sm text-gray-600">Nama Lengkap</p>
                <p className="font-medium">{user.name}</p>
                </div>
                <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{user.email}</p>
                </div>
                <div>
                <p className="text-sm text-gray-600">Nomor Telepon</p>
                <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                <p className="text-sm text-gray-600">Lokasi</p>
                <p className="font-medium">{user.location}</p>
                </div>
                <div>
                <p className="text-sm text-gray-600">Status Akun</p>
                <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                    {user.status}
                </span>
                </div>
                <div>
                <p className="text-sm text-gray-600">Bergabung Sejak</p>
                <p className="font-medium">{user.joined}</p>
                </div>
            </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex border-b border-gray-200 mb-6">
            <button
                onClick={() => setActiveTab("iklan")}
                className={`px-4 py-2 font-medium text-sm ${
                activeTab === "iklan"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
                Iklan yang Dipasang
            </button>
            <button
                onClick={() => setActiveTab("pembelian")}
                className={`px-4 py-2 font-medium text-sm ${
                activeTab === "pembelian"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
            >
                Produk yang Dibeli
            </button>
            </div>

            {/* Konten Tab */}
            {activeTab === "iklan" ? (
            <div>
                {activeListings.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-500">Pengguna ini belum memiliki iklan yang disetujui.</p>
                </div>
                ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dipublikasikan</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {activeListings.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                            <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-[#DDE7FF] text-[#1E3A8A] rounded-full text-xs">
                                {product.category}
                            </span>
                            </td>
                            <td className="px-6 py-4">Rp. {product.price}</td>
                            <td className="px-6 py-4 text-gray-700">{product.publishedAt}</td>
                            <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                Aktif
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
            ) : (
            <div>
                {currentPurchases.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                    <p className="text-gray-500">Pengguna ini belum membeli produk.</p>
                </div>
                ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Beli</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {currentPurchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium text-gray-900">{purchase.productName}</td>
                            <td className="px-6 py-4 text-gray-700">{purchase.seller}</td>
                            <td className="px-6 py-4">Rp. {purchase.price}</td>
                            <td className="px-6 py-4 text-gray-700">{purchase.purchaseDate}</td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                                purchase.status === "Diterima" ? "bg-green-100 text-green-800" :
                                "bg-blue-100 text-blue-800"
                            }`}>
                                {purchase.status}
                            </span>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                )}
            </div>
            )}
        </div>
        </AdminLayout>
    );
    }