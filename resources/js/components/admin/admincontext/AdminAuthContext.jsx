import React, { createContext, useState, useContext, useMemo, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'; // Gunakan VITE jika pakai Vite

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [admin, setAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch {
      return null;
    }
  });
   

  const adminLogout = useCallback(() => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
  }, []);

  const adminLogin = useCallback(async (credentials) => {
    setLoading(true);
    setAuthError("");
    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        const msg = result.message || 'Email atau password salah';
        setAuthError(msg); // <--- SET ERROR DI SINI
        return { success: false, message: msg };
      }

      if (result.success && result.data?.token) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.setItem('admin_token', result.data.token);
        localStorage.setItem('admin_user', JSON.stringify(result.data.admin));
        setAdmin(result.data.admin);
        
        return { success: true };
      }
      
      return { success: false, message: 'Login admin gagal' };
    } catch (error) {
      return { success: false, message: 'Terjadi kesalahan jaringan' };
    } finally {
      setLoading(false);
    }
  }, []);

  // Gunakan useMemo agar object value tidak dianggap "baru" setiap kali render
  const value = useMemo(() => ({
    admin,
    loading,
    isAdminAuthenticated: !!admin,
    adminLogin,
    adminLogout,
    authError,    // <--- KIRIM KE VALUE
    setAuthError, // <--- KIRIM KE VALUE UNTUK RESET MANUAL
  }), [admin, loading, adminLogin, adminLogout,authError]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};