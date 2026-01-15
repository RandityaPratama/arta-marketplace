import React, { createContext, useState, useContext, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const AdminProfileContext = createContext(null);

export const useAdminProfile = () => {
  const context = useContext(AdminProfileContext);
  if (!context) {
    throw new Error('useAdminProfile must be used within AdminProfileProvider');
  }
  return context;
};

export const AdminProfileProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);

  const fetchAdminProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengambil data profil');
      }

      if (result.success) {
        setAdminProfile(result.data.admin);
        return { success: true, data: result.data.admin };
      }

      throw new Error('Gagal mengambil data profil');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAdminProfile = useCallback(async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/profile/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui profil');
      }

      if (result.success) {
        setAdminProfile(result.data.admin);
        
        // Update localStorage
        const storedAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');
        const updatedAdmin = { ...storedAdmin, ...result.data.admin };
        localStorage.setItem('admin_user', JSON.stringify(updatedAdmin));
        
        return { success: true, message: result.message };
      }

      throw new Error('Gagal memperbarui profil');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAvatar = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`${API_URL}/admin/profile/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal memperbarui avatar');
      }

      if (result.success) {
        // Update local state
        setAdminProfile(prev => ({
          ...prev,
          avatar: result.data.avatar
        }));

        // Update localStorage
        const storedAdmin = JSON.parse(localStorage.getItem('admin_user') || '{}');
        storedAdmin.avatar = result.data.avatar;
        localStorage.setItem('admin_user', JSON.stringify(storedAdmin));

        return { success: true, message: result.message, avatar: result.data.avatar };
      }

      throw new Error('Gagal memperbarui avatar');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const changePassword = useCallback(async (passwordData) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_URL}/admin/profile/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(passwordData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengubah password');
      }

      if (result.success) {
        return { success: true, message: result.message };
      }

      throw new Error('Gagal mengubah password');
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    adminProfile,
    loading,
    error,
    fetchAdminProfile,
    updateAdminProfile,
    updateAvatar,
    changePassword,
  };

  return (
    <AdminProfileContext.Provider value={value}>
      {children}
    </AdminProfileContext.Provider>
  );
};
