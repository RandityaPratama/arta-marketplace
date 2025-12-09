    // src/pages/FavoritPage.js
    import React from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Background from "./Background";
    import Footer from "./Footer";
    import { useFavorites } from "../components/context/FavoriteContext"; // ✅ Import context

    // ✅ Data semua produk (bisa dari API nanti)
    const allProducts = [
    { id: 1, name: "Samsung S24 Ultra", category: "Elektronik", price: "12.000.000", location: "Jakarta Utara" },
    { id: 2, name: "iPhone 15 Pro", category: "Elektronik", price: "15.500.000", location: "Bandung" },
    { id: 3, name: "Kursi Gaming", category: "Furnitur", price: "2.300.000", location: "Surabaya" },
    { id: 4, name: "Sepatu Nike", category: "Fashion", price: "1.200.000", location: "Yogyakarta" },
    ];

    export default function FavoritPage() {
    const navigate = useNavigate();
    const { favorites } = useFavorites(); // ✅ Ambil daftar favorit

    // ✅ Filter produk yang difavoritkan
    const favoriteProducts = allProducts.filter(product => favorites.has(product.id));
    const totalFavorites = favoriteProducts.length;

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-800">Daftar Favorit Anda</h1>
                <p className="text-sm text-gray-600 mt-1">
                    {totalFavorites > 0
                    ? `${totalFavorites} produk favorit`
                    : "Klik ikon ❤️ di produk untuk menyimpannya ke sini"}
                </p>
                </div>
                <Button variant="primary" size="md" onClick={() => navigate(-1)}>
                Kembali
                </Button>
            </div>

            {totalFavorites === 0 ? (
                <div className="max-w-2xl mx-auto mt-8">
                <div className="bg-white rounded-xl p-8 text-center shadow-[0px_4px_11px_rgba(0,0,0,0.07)] border border-gray-200">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-[#f0f7ff] rounded-full mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.8}
                        stroke="#1E3A8A"
                        className="w-7 h-7"
                    >
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>
                    </div>
                    <h3 className="text-[18px] font-[600] text-gray-800 mb-2">Belum ada favorit?</h3>
                    <p className="text-[14px] text-gray-600 mb-6">
                    Jelajahi produk dan klik ikon hati untuk menambahkannya ke daftar favorit.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <Button variant="primary" size="md" onClick={() => navigate("/dashboard")}>
                        Jelajahi Produk
                    </Button>
                    <Button variant="outline" size="md" onClick={() => navigate("/sell")}>
                        Jual Barang
                    </Button>
                    </div>
                </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {favoriteProducts.map((product) => (
                    <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-[0px_4px_11px_rgba(0,0,0,0.07)] relative cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                    >
                    <div className="bg-gray-200 h-32 w-full"></div>
                    <div className="p-5">
                        <span className="inline-block bg-[#DDE7FF] text-[#1E3A8A] text-[13px] font-[500] px-2 py-1 rounded-full mb-2">
                        {product.category}
                        </span>
                        <h3 className="text-[15px] font-[500] text-gray-800">{product.name}</h3>
                        <p className="text-[15px] font-bold text-black mt-2">Rp. {product.price}</p>
                        <p className="text-[13px] text-gray-500 mt-1">{product.location}</p>
                    </div>
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="#1E3A8A" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
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