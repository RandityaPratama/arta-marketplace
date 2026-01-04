    // src/components/DiskonPage.js
    import React from "react";
    import { useNavigate } from "react-router-dom";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background";
    import { Heart } from "lucide-react";
    import Button from "../components/ui/Button";
    import { useFavorites } from "../components/context/FavoriteContext";
    import { useProducts } from "../components/context/ProductContext";

    // ✅ Fungsi format harga
    const formatPrice = (priceStr) => {
    if (!priceStr) return "";
    const clean = priceStr.toString().replace(/\D/g, '');
    if (!clean) return "";
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // ✅ POSISI VERTIKAL FLEKSIBEL
    const badgeVerticalPosition = '51%';

    export default function DiskonPage() {
    const navigate = useNavigate();
    const { toggleFavorite, isFavorited } = useFavorites();
    const { products } = useProducts();

    // ✅ Filter hanya produk diskon yang aktif
    const discountProducts = products
        .filter(p => p.onDiscount && p.status === "aktif");

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            {/* ✅ HEADER DENGAN TOMBOL KEMBALI DI KANAN ATAS */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Diskon Spesial Hari Ini</h1>
                <p className="text-gray-600 mt-1">Dapatkan barang dengan diskon sebesar-besarnya!</p>
                </div>
                <Button variant="primary" size="md" onClick={() => navigate(-1)}>
                Kembali
                </Button>
            </div>

            {discountProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                Tidak ada produk diskon saat ini.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {discountProducts.map((product) => (
                    <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-[0px_4px_11px_rgba(0,0,0,0.07)] relative cursor-pointer"
                    onClick={() => {
                        // ✅ Navigasi cerdas
                        if (product.sellerId === "user-1") {
                        navigate(`/detailseller/${product.id}`);
                        } else {
                        navigate(`/product/${product.id}`);
                        }
                    }}
                    >
                    {/* Badge Diskon */}
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                        -{product.discount}%
                    </div>

                    {/* ✅ FAVORIT ICON - UKURAN KONSISTEN */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                        }}
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center z-10 hover:bg-gray-50"
                    >
                        {isFavorited(product.id) ? (
                        <Heart size={20} className="text-[#1E3A8A]" fill="#1E3A8A" strokeWidth={0} />
                        ) : (
                        <Heart size={20} className="text-[#1E3A8A]" strokeWidth={1.5} />
                        )}
                    </Button>

                    {/* ✅ BADGE "IKLANKU" */}
                    {product.sellerId === "user-1" && (
                        <div 
                        className="absolute right-0 transform -translate-y-1/2 bg-[#1E3A8A] text-white text-[11px] font-[600] px-2 py-1.5 rounded-l-full z-10 whitespace-nowrap"
                        style={{ top: badgeVerticalPosition }}
                        >
                        Iklanku
                        </div>
                    )}

                    <div className="bg-gray-200 h-32 w-full overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                        )}
                    </div>
                    <div className="p-5">
                        <span className="inline-block bg-[#DDE7FF] text-[#1E3A8A] text-[13px] font-[500] px-2 py-1 rounded-full mb-2">
                        {product.category}
                        </span>
                        <h3 className="text-[15px] font-[500] text-gray-800">{product.name}</h3>
                        
                        {/* Harga dengan format titik */}
                        <div className="mt-2">
                        <p className="text-[15px] font-bold text-gray-500 line-through">
                            Rp. {formatPrice(product.originalPrice)}
                        </p>
                        <p className="text-[18px] font-bold text-red-600 mt-1">
                            Rp. {formatPrice(product.price)}
                        </p>
                        </div>
                        
                        <p className="text-[13px] text-gray-500 mt-2">{product.location}</p>
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