import React, { createContext, useContext, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const AdminSettingContext = createContext();

export const useAdminSetting = () => useContext(AdminSettingContext);

export const AdminSettingProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [reportReasons, setReportReasons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Fetch All Settings (Categories & Report Reasons)
  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch(`${API_URL}/admin/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setCategories(result.data.categories);
        setReportReasons(result.data.report_reasons);
      } else {
        setError(result.message || "Gagal mengambil pengaturan.");
      }
    } catch (err) {
      console.error("Error fetching settings:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Helper untuk request POST/DELETE
  const apiRequest = async (endpoint, method, body = null) => {
    const token = localStorage.getItem('admin_token');
    try {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          ...(body && { 'Content-Type': 'application/json' })
        },
        ...(body && { body: JSON.stringify(body) })
      };

      const response = await fetch(`${API_URL}/admin/settings/${endpoint}`, options);
      const result = await response.json();
      return result;
    } catch (err) {
      console.error(`Error ${method} ${endpoint}:`, err);
      return { success: false, message: "Terjadi kesalahan jaringan." };
    }
  };

  // --- Categories Actions ---
  const addCategory = async (name) => {
    const result = await apiRequest('categories', 'POST', { name });
    if (result.success) {
      setCategories(prev => [...prev, result.data]);
    }
    return result;
  };

  const deleteCategory = async (id) => {
    const result = await apiRequest(`categories/${id}`, 'DELETE');
    if (result.success) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
    return result;
  };

  // --- Report Reasons Actions ---
  const addReportReason = async (reason, type = 'general') => {
    const result = await apiRequest('report-reasons', 'POST', { reason, type });
    if (result.success) {
      setReportReasons(prev => [...prev, result.data]);
    }
    return result;
  };

  const deleteReportReason = async (id) => {
    const result = await apiRequest(`report-reasons/${id}`, 'DELETE');
    if (result.success) {
      setReportReasons(prev => prev.filter(r => r.id !== id));
    }
    return result;
  };

  return (
    <AdminSettingContext.Provider value={{
      categories,
      reportReasons,
      loading,
      error,
      fetchSettings,
      addCategory,
      deleteCategory,
      addReportReason,
      deleteReportReason
    }}>
      {children}
    </AdminSettingContext.Provider>
  );
};