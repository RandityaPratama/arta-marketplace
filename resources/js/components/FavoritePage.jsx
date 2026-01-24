// src/components/FavoritePage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import NavbarAfter from "./NavbarAfter";
import Background from "../components/Background";
import Footer from "./Footer";
import { useFavorites } from "../components/context/FavoriteContext";
import { useProducts } from "../components/context/ProductContext";
import { Heart } from "lucide-react";

// ✅ Fungsi format harga
const formatPrice = (price) => {
  if (price === undefined || price === null) return "";
  return Number(price).toLocaleString('id-ID');
};

// ✅ POSISI VERTIKAL FLEKSIBEL
const badgeVerticalPosition = '54%';

export default function FavoritePage() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorited } = useFavorites(); // ✅ Tambahkan toggleFavorite dan isFavorited
  const { products } = useProducts();

  // ✅ Filter produk yang di-favoritkan dan aktif
  const favoriteProducts = products
    .filter(p => favorites.has(p.id) && p.status === "aktif");
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
                  onClick={() => {
                    // ✅ Navigasi cerdas: produk sendiri vs orang lain
                    if (product.is_mine) {
                      navigate(`/detailseller/${product.id}`);
                    } else {
                      navigate(`/product/${product.id}`);
                    }
                  }}
                >
                  {/* ✅ Badge Diskon */}
                  {product.onDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      -{product.discount}%
                    </div>
                  )}

                  {/* ✅ FAVORIT ICON - BISA DIKLIK! */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation(); // ✅ Mencegah navigasi saat klik favorit
                      toggleFavorite(product.id);
                    }}
                    className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center z-10 hover:bg-gray-50"
                  >
                    {isFavorited(product.id) ? (
                      <Heart size={20} className="text-[#1E3A8A]" fill="currentColor" />
                    ) : (
                      <Heart size={20} className="text-[#1E3A8A]" strokeWidth={1.5} />
                    )}
                  </Button>

                  {/* ✅ BADGE "IKLANKU" */}
                  {product.is_mine && (
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
                    
                    {/* ✅ Tampilan harga dengan diskon */}
                    {product.onDiscount ? (
                      <div className="mt-1">
                        <p className="text-[13px] text-gray-500 line-through">
                          Rp. {formatPrice(product.originalPrice)}
                        </p>
                        <p className="text-[15px] font-bold text-red-600">
                          Rp. {formatPrice(product.price)}
                        </p>
                      </div>
                    ) : (
                      <p className="text-[15px] font-bold text-black mt-2">
                        Rp. {formatPrice(product.price)}
                      </p>
                    )}
                    
                    <p className="text-[13px] text-gray-500 mt-1">{product.location}</p>
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