// components/context/FavoriteContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const FavoriteContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoriteProvider");
  }
  return context;
};

export const FavoriteProvider = ({ children }) => {
  // ✅ SET KOSONG - TIDAK ADA PRODUK YANG LANGSUNG DIFAVORITKAN
  const [favorites, setFavorites] = useState(new Set());
  const { isAuthenticated } = useAuth();

  // ✅ Fetch favorites dari database saat komponen dimuat atau status login berubah
  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setFavorites(new Set()); // Reset favorit jika logout
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get('/api/favorites', { headers });
        // API mengembalikan array ID, kita ubah ke Set
        setFavorites(new Set(response.data));
      } catch (error) {
        // Error handling silent (misal user belum login)
        console.log("Info: Belum login atau gagal mengambil favorit.");
      }
    };
    fetchFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (productId) => {
    // 1. Optimistic Update (Update UI duluan biar cepat)
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    // 2. Kirim Request ke Backend
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.post('/api/favorites/toggle', { product_id: productId }, { headers });
    } catch (error) {
      console.error("Gagal update favorite:", error);
      // Jika gagal, kembalikan state (revert) - Opsional, bisa ditambahkan logika revert di sini
      alert("Gagal memproses favorit. Silakan coba lagi.");
    }
  };

  const isFavorited = (productId) => favorites.has(productId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoriteContext.Provider>
  );
};