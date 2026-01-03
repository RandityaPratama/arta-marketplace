import React, { createContext, useContext, useState, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const AdminProductContext = createContext();

export const useAdminProduct = () => useContext(AdminProductContext);

export const AdminProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [error, setError] = useState(null);

  // ✅ Fetch Products dari API Laravel
  const fetchProducts = useCallback(async (status = "semua", page = 1, search = "") => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('admin_token');

    try {
      const queryParams = new URLSearchParams({
        status,
        page,
        search
      }).toString();

      const response = await fetch(`${API_URL}/admin/products?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setProducts(result.data);
        setPagination(result.pagination);
      } else {
        setError(result.message || "Gagal mengambil data produk.");
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Terjadi kesalahan jaringan.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Update Status Produk (Approve, Reject, Hide)
  const updateProductStatus = async (id, status, reason = null) => {
    const token = localStorage.getItem('admin_token');
    try {
      const response = await fetch(`${API_URL}/admin/products/${id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status, reason })
      });

      const result = await response.json();

      if (result.success) {
        // Update state lokal secara optimistik agar UI responsif
        setProducts((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: status } : p
          )
        );
        return { success: true, message: result.message };
      }
      return { success: false, message: result.message || "Gagal memperbarui status." };
    } catch (err) {
      console.error("Error updating status:", err);
      return { success: false, message: "Terjadi kesalahan jaringan." };
    }
  };

  // Helper functions untuk aksi spesifik
  const approveProduct = (id) => updateProductStatus(id, "aktif");
  const rejectProduct = (id, reason) => updateProductStatus(id, "ditolak", reason);
  const hideProduct = (id) => updateProductStatus(id, "disembunyikan");

  return (
    <AdminProductContext.Provider
      value={{
        products,
        loading,
        pagination,
        error,
        fetchProducts,
        approveProduct,
        rejectProduct,
        hideProduct,
      }}
    >
      {children}
    </AdminProductContext.Provider>
  );
};