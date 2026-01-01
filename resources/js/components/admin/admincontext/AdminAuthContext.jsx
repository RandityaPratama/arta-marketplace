import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const storedAdmin = localStorage.getItem('admin_user');
      return storedAdmin ? JSON.parse(storedAdmin) : null;
    } catch {
      return null;
    }
  });
  
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  const adminLogin = async (credentials) => {
    setLoading(true);
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
        return { 
          success: false, 
          message: result.message || 'Login admin gagal' 
        };
      }

      if (result.success && result.data?.token) {
        
        localStorage.setItem('admin_token', result.data.token);
        localStorage.setItem('admin_user', JSON.stringify(result.data.admin));
        setAdmin(result.data.user);
        
        return { 
          success: true, 
          data: result.data 
        };
      }
      
      return { 
        success: false, 
        message: result.message || 'Login admin gagal' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan jaringan' 
      };
    } finally {
      setLoading(false);
    }
  };

 
  const adminLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
    navigate('/admin/login');
  };

 
  const isAdminAuthenticated = !!admin && !!localStorage.getItem('admin_token');

 
  const getAdminToken = () => {
    return localStorage.getItem('admin_token');
  };

 
  const adminFetch = async (url, options = {}) => {
    const token = getAdminToken();
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_URL}${url}`, {
      ...options,
      headers,
    });
    
    if (response.status === 401) {
      adminLogout();
      throw new Error('Unauthorized');
    }
    
    return response;
  };

  const value = {
    admin,
    loading,
    isAdminAuthenticated,
    adminLogin,
    adminLogout,
    getAdminToken,
    adminFetch
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};