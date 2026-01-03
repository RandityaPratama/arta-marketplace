import React, { createContext, useContext, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const AdminUserContext = createContext();

export const useAdminUser = () => useContext(AdminUserContext);

export const AdminUserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Untuk detail user
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  // ✅ Fetch Users List (dengan pagination & search)
  const fetchUsers = useCallback(async (page = 1, search = "") => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');

    try {
      const queryParams = new URLSearchParams({
        page,
        search
      }).toString();

      const response = await fetch(`${API_URL}/admin/users?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setUsers(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message || "Gagal mengambil data pengguna.");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch User Detail (untuk halaman profil)
  const fetchUserById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');

    try {
      const response = await fetch(`${API_URL}/admin/users/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setCurrentUser(result.data);
      } else {
        setError(result.message || "Gagal mengambil detail pengguna.");
      }
    } catch (err) {
      console.error("Error fetching user detail:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update User Status (Block/Activate)
  const updateUserStatus = async (id, status) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_URL}/admin/users/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status }) // status: "Aktif" or "Diblokir"
      });

      const result = await response.json();

      if (result.success) {
        // Update state lokal agar UI langsung berubah
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, status: status } : u))
        );
        
        // Jika sedang melihat detail user ini, update juga state detailnya
        if (currentUser && currentUser.user.id === id) {
             setCurrentUser(prev => ({
                 ...prev,
                 user: { ...prev.user, status: status }
             }));
        }

        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || "Gagal memperbarui status." };
    } catch (err) {
      console.error("Error updating user status:", err);
      return { success: false, message: "Terjadi kesalahan jaringan." };
    }
  };

  return (
    <AdminUserContext.Provider
      value={{
        users,
        currentUser,
        loading,
        pagination,
        error,
        fetchUsers,
        fetchUserById,
        updateUserStatus,
      }}
    >
      {children}
    </AdminUserContext.Provider>
  );
};