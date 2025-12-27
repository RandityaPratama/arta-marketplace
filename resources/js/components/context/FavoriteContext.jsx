// components/context/FavoriteContext.js
import React, { createContext, useContext, useState } from "react";

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

  const toggleFavorite = (productId) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const isFavorited = (productId) => favorites.has(productId);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorited }}>
      {children}
    </FavoriteContext.Provider>
  );
};