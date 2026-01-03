import React, { createContext, useState, useContext, useMemo, useCallback, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'; // Gunakan VITE jika pakai Vite

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
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

  // ✅ Cek validitas token ke server saat aplikasi dimuat
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
       
        const response = await fetch(`${API_URL}/admin/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Token invalid');
        }
        
        await response.json();
      } catch (error) {
        console.log(error);
        adminLogout();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [adminLogout]);

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
        setAuthError(msg); 
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

  
  const value = useMemo(() => ({
    admin,
    loading,
    isAdminAuthenticated: !!admin,
    adminLogin,
    adminLogout,
    authError,    
    setAuthError, 
  }), [admin, loading, adminLogin, adminLogout,authError]);

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};