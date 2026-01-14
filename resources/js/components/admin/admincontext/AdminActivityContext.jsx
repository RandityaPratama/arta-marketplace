import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const AdminActivityContext = createContext();

export const useAdminActivity = () => useContext(AdminActivityContext);

export const AdminActivityProvider = ({ children }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: '',
    search: '',
    date_from: '',
    date_to: '',
  });

  // ✅ Fetch Activities dari API Laravel
  const fetchActivities = useCallback(async (page = 1, perPage = 20) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');

    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        per_page: perPage.toString(),
        ...filters
      }).toString();

      const response = await fetch(`${API_URL}/admin/activities?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setActivities(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message || "Gagal mengambil data aktivitas.");
      }
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // ✅ Auto-fetch saat filters berubah
  useEffect(() => {
    fetchActivities(1, 20); // Reset ke halaman 1 saat filter berubah
  }, [filters, fetchActivities]);

  // ✅ Update Filters
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  }, []);

  // ✅ Clear Filters
  const clearFilters = useCallback(() => {
    setFilters({
      type: '',
      search: '',
      date_from: '',
      date_to: '',
    });
  }, []);

  // ✅ Refresh Activities (tanpa mengubah filter)
  const refreshActivities = useCallback(() => {
    fetchActivities(pagination.current_page || 1, pagination.per_page || 20);
  }, [fetchActivities, pagination]);

  return (
    <AdminActivityContext.Provider
      value={{
        activities,
        loading,
        pagination,
        error,
        filters,
        fetchActivities,
        updateFilters,
        clearFilters,
        refreshActivities,
      }}
    >
      {children}
    </AdminActivityContext.Provider>
  );
};
