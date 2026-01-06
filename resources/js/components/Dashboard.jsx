// src/components/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import { Bell, Plus, Heart, User } from "lucide-react";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import SearchBar from "./SearchBar";
import Background from "../components/Background";
import { useFavorites } from "../components/context/FavoriteContext";
import { useProducts } from "../components/context/ProductContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// ✅ Fungsi format harga: 12000000 → "12.000.000"
const formatPrice = (priceStr) => {
  if (!priceStr) return "";
  const clean = priceStr.toString().replace(/\D/g, '');
  if (!clean) return "";
  return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { favorites, toggleFavorite, isFavorited } = useFavorites();
  const { products, fetchProducts } = useProducts();

  // ✅ Fetch data terbaru setiap kali Dashboard dibuka
  useEffect(() => {
    if (fetchProducts) {
      fetchProducts();
    }
  }, [fetchProducts]);

  const [categories, setCategories] = useState(["Semua"]);

  // ✅ Fetch Kategori dari API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();
        if (result.success) {
          setCategories(["Semua", ...result.data.map(c => c.name)]);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // ✅ POSISI VERTIKAL FLEKSIBEL - BISA DIUBAH SESUAI KEBUTUHAN
  const badgeVerticalPosition = '55%'; // ✅ Ganti nilai ini: '30%', '35%', '40%', '45%', '50%', dll

  const filteredProducts = products
    .filter(product => product.status === "aktif")
    .filter(product => 
      selectedCategory === "Semua" || selectedCategory === "Semua kategori" || product.category === selectedCategory
    );

  const totalProducts = filteredProducts.length;

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6  md:px-8 lg:px-12 py-8">
          <SearchBar onCategoryChange={setSelectedCategory} />

          {/* Promo Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-r from-[#1E3A8A] to-red-300 h-[170px] rounded-xl border border-[#1E3A8A] flex items-center justify-between px-6 text-white">
              <div className="w-[120px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                <Plus size={40} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1 ml-5">
                <h3 className="text-[18px] font-[700]">Iklan Terpopuler</h3>
                <p className="text-[14px] mt-1 opacity-90">Temukan barang paling diminati!</p>
                <Button variant="primary" size="sm" onClick={() => navigate("/popular")}>
                  Lihat Sekarang
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-[#1E3A8A] to-green-300 h-[170px] rounded-xl border border-[#1E3A8A] flex items-center justify-between px-6 text-white">
              <div className="w-[120px] h-[100px] bg-gray-200 rounded-lg flex items-center justify-center">
                <User size={40} className="text-white" strokeWidth={1.5} />
              </div>
              <div className="flex-1 ml-5">
                <h3 className="text-[18px] font-[700]">Diskon Spesial!</h3>
                <p className="text-[14px] mt-1 opacity-90">Dapatkan barang dengan diskon sebesar-besarnya!</p>
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
              className="flex items-center gap-3 p-5 border border-[#1E3A8A] rounded-lg hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] transition w-full text-[#1E3A8A]"
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
              className="flex items-center gap-3 p-5 border border-[#1E3A8A] rounded-lg hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] transition w-full text-[#1E3A8A]"
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
              className="flex items-center gap-3 p-5 border border-[#1E3A8A] rounded-lg hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] transition w-full text-[#1E3A8A]"
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

          <div className="mb-8 flex justify-between items-center">
            <h2 className="text-[15px] font-[500] text-gray-700">{totalProducts} produk</h2>
            <Button variant="primary" size="md" onClick={() => navigate("/notif")}>
              <Bell size={18} className="text-white mr-1" strokeWidth={1.8} />
              Notifikasi
            </Button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada produk yang tersedia.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
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
                  {/* ✅ Badge Diskon (pojok kiri atas) */}
                  {product.onDiscount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                      -{product.discount}%
                    </div>
                  )}

                  {/* ✅ FAVORIT ICON (pojok kanan atas - AMAN) */}
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
                      <Heart size={18} className="text-[#1E3A8A]" fill="#1E3A8A" strokeWidth={0} />
                    ) : (
                      <Heart size={18} className="text-[#1E3A8A]" strokeWidth={1.5} />
                    )}
                  </Button>

                  {/* ✅ BADGE "IKLANKU" (sisi kanan - POSISI FLEKSIBEL) */}
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