// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Helper function untuk fetch dengan token
  const fetchWithAuth = async (url, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
      throw new Error('Unauthorized');
    }
    
    return response;
  };

  // Check user authentication status
  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetchWithAuth(`${API_URL}/me`);
      const result = await response.json();
      
      if (result.success && result.data?.user) {
        setUser(result.data.user);
      } else {
        // Token tidak valid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Login function - menggunakan fetch seperti yang sudah ada
  const login = async (credentials) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
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
          message: result.message || 'Login gagal' 
        };
      }

      if (result.success && result.data?.token) {
        // Simpan token dan user data
        localStorage.setItem('token', result.data.token);
        if (result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
          setUser(result.data.user);
        }
        
        return { 
          success: true, 
          data: result.data 
        };
      }
      
      return { 
        success: false, 
        message: 'Login gagal. Silakan coba lagi.' 
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan jaringan' 
      };
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (result.success && result.data?.token) {
        // Auto login setelah register
        localStorage.setItem('token', result.data.token);
        if (result.data.user) {
          localStorage.setItem('user', JSON.stringify(result.data.user));
          setUser(result.data.user);
        }
        
        return { 
          success: true, 
          data: result.data 
        };
      } else {
        return { 
          success: false, 
          message: result.message || 'Registrasi gagal',
          errors: result.errors 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: error.message || 'Terjadi kesalahan jaringan' 
      };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await fetchWithAuth(`${API_URL}/logout`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      
      // Redirect ke login
      navigate('/login');
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user && !!localStorage.getItem('token'),
    login,
    register,
    logout,
    checkAuth,
    fetchWithAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};