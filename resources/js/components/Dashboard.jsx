    // src/pages/Dashboard.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import { Bell, Plus, Heart, User } from "lucide-react";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import SearchBar from "./SearchBar";
    import Background from "../components/Background";
    import { useFavorites } from "../components/context/FavoriteContext"; // ✅ Pastikan path benar

    export default function Dashboard() {
    const navigate = useNavigate();
    const { favorites, toggleFavorite, isFavorited } = useFavorites(); // ✅ Gunakan context

    // ✅ Data produk lengkap (dengan publishedDate & condition)
    const initialProducts = [
        { id: 1, name: "Samsung S24 Ultra", category: "Elektronik", price: "12.000.000", location: "Jakarta Utara", publishedDate: "11/10/2025", condition: "Bekas Baik", status: "aktif" },
        { id: 2, name: "iPhone 15 Pro", category: "Elektronik", price: "15.500.000", location: "Bandung", publishedDate: "12/10/2025", condition: "Baru", status: "aktif" },
        { id: 3, name: "Kursi Gaming", category: "Furnitur", price: "2.300.000", location: "Surabaya", publishedDate: "10/10/2025", condition: "Bekas Baik", status: "aktif" },
        { id: 4, name: "Adidas Adizero Evo SL", category: "Olahraga", price: "1.200.000", location: "Yogyakarta", publishedDate: "09/10/2025", condition: "Mulus", status: "aktif" },
    ];

    const [products] = useState(initialProducts);
    const totalProducts = products.length;

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <SearchBar />

            {/* ✅ Promo Banners — DIKEMBALIKAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-gradient-to-r from-[#1E3A8A] to-[#FED7AA] h-[140px] rounded-xl border border-[#1E3A8A] flex items-center justify-between px-6 text-white">
                <div className="w-[120px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <Plus size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1 ml-5">
                    <h3 className="text-[18px] font-[700]">Iklan Terpopuler</h3>
                    <p className="text-[14px] mt-1 opacity-90">Produk paling banyak dibeli minggu ini</p>
                    <Button variant="primary" size="sm" onClick={() => navigate("/kategori/terpopuler")}>
                    Lihat Sekarang
                    </Button>
                </div>
                </div>

                <div className="bg-gradient-to-r from-[#1E3A8A] to-[#FED7AA] h-[140px] rounded-xl border border-[#1E3A8A] flex items-center justify-between px-6 text-white">
                <div className="w-[120px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <User size={40} className="text-white" strokeWidth={1.5} />
                </div>
                <div className="flex-1 ml-5">
                    <h3 className="text-[18px] font-[700]">Diskon Spesial!</h3>
                    <p className="text-[14px] mt-1 opacity-90">Harga turun hingga 50% hari ini</p>
                    <Button variant="primary" size="sm" onClick={() => navigate("/diskon")}>
                    Ambil Diskon
                    </Button>
                </div>
                </div>
            </div>

            {/* Three Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <button
                onClick={() => navigate("/sell")}
                className="flex items-center gap-3 p-5 border border-[#1E3A8A] rounded-lg hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] transition w-full bg-white text-[#1E3A8A]"
                >
                <div className="w-10 h-10 bg-[#DDE7FF] rounded-md flex items-center justify-center">
                    <Plus size={20} className="text-[#1E3A8A]" strokeWidth={2} />
                </div>
                <div className="text-left">
                    <h3 className="text-[17px] font-[600]">Jual Barang</h3>
                    <p className="text-[13px] text-gray-600 mt-1">Unggah produk baru</p>
                </div>
                </button>

                <button
                onClick={() => navigate("/favorite")}
                className="flex items-center gap-3 p-5 border border-[#1E3A8A] rounded-lg hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] transition w-full bg-white text-[#1E3A8A]"
                >
                <div className="w-10 h-10 bg-[#f3cbcb] rounded-md flex items-center justify-center">
                    <Heart size={20} className="text-[#ec3030]" strokeWidth={2} />
                </div>
                <div className="text-left">
                    <h3 className="text-[17px] font-[600]">Favorit</h3>
                    <p className="text-[13px] text-gray-600 mt-1">Lihat produk favorit</p>
                </div>
                </button>

                <button
                onClick={() => navigate("/profile")}
                className="flex items-center gap-3 p-5 border border-[#1E3A8A] rounded-lg hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] transition w-full bg-white text-[#1E3A8A]"
                >
                <div className="w-10 h-10 bg-[#D5F0DD] rounded-md flex items-center justify-center">
                    <User size={20} className="text-[#119639]" strokeWidth={2} />
                </div>
                <div className="text-left">
                    <h3 className="text-[17px] font-[600]">Profil</h3>
                    <p className="text-[13px] text-gray-600 mt-1">Kelola akun anda</p>
                </div>
                </button>
            </div>

            {/* Product Section Header */}
            <div className="mb-8 flex justify-between items-center">
                <h2 className="text-[15px] font-[500] text-gray-700">{totalProducts} produk</h2>
                <Button variant="primary" size="md" onClick={() => navigate("/notification")}>
                <Bell size={18} className="text-white mr-1" strokeWidth={1.8} />
                Notifikasi
                </Button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-[0px_4px_11px_rgba(0,0,0,0.07)] relative cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                >
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center z-10 hover:bg-gray-50"
                    aria-label={isFavorited(product.id) ? "Hapus dari favorit" : "Tambah ke favorit"}
                    >
                    {isFavorited(product.id) ? (
                        <Heart size={18} className="text-[#1E3A8A]" fill="#1E3A8A" strokeWidth={0} />
                    ) : (
                        <Heart size={18} className="text-[#1E3A8A]" strokeWidth={1.5} />
                    )}
                    </Button>

                    <div className="bg-gray-200 h-32 w-full"></div>
                    <div className="p-5">
                    <span className="inline-block bg-[#DDE7FF] text-[#1E3A8A] text-[13px] font-[500] px-2 py-1 rounded-full mb-2">
                        {product.category}
                    </span>
                    <h3 className="text-[15px] font-[500] text-gray-800">{product.name}</h3>
                    <p className="text-[15px] font-bold text-black mt-2">Rp. {product.price}</p>
                    <p className="text-[13px] text-gray-500 mt-1">{product.location}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
        </Background>
        <Footer />
        </>
    );
    }