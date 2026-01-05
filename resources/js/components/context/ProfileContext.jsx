import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const ProfileContext = createContext();

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
};

export const ProfileProvider = ({ children }) => {
  const { user, checkAuth, fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  // ✅ Update Profile
  const updateProfile = async (formData) => {
    setLoading(true);
    try {
      let response;

      // ✅ Cek ketersediaan fetchWithAuth (Defensive Programming)
      if (typeof fetchWithAuth === 'function') {
        response = await fetchWithAuth(`${API_URL}/profile/update`, { 
          method: 'POST',
          body: JSON.stringify(formData)
        });
      } else {
        // ⚠️ Fallback manual jika fetchWithAuth tidak tersedia (misal AuthContext belum update)
        const token = localStorage.getItem('token');
        response = await fetch(`${API_URL}/profile/update`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
      }

      const result = await response.json();

      if (response.ok && result.success) {
        if (checkAuth) await checkAuth(); // Refresh data user di AuthContext
        return { success: true, message: "Profil berhasil diperbarui" };
      } else {
        return { success: false, message: result.message || "Gagal memperbarui profil" };
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      return { success: false, message: "Terjadi kesalahan jaringan" };
    } finally {
      setLoading(false);
    }
  };

  // ✅ Format Tanggal Bergabung
  const getJoinDate = () => {
    if (!user || !user.created_at) return "-";
    const date = new Date(user.created_at);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <ProfileContext.Provider value={{ user, loading, updateProfile, getJoinDate }}>
      {children}
    </ProfileContext.Provider>
  );
};