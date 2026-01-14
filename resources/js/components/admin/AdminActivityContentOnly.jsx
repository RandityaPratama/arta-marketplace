import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { useAdminActivity } from "./admincontext/AdminActivityContext";

export default function AdminActivityContentOnly() {
  const { activities, loading, pagination, error, filters, updateFilters } = useAdminActivity();

  const [filter, setFilter] = useState("semua");

  useEffect(() => {
    updateFilters({ type: filter === "semua" ? "" : filter });
  }, [filter, updateFilters]);

  const filteredActivities = activities;

  const getActivityColor = (type) => {
    switch (type) {
      case "produk": return "bg-blue-100 text-blue-800";
      case "transaksi": return "bg-green-100 text-green-800";
      case "pengguna": return "bg-indigo-100 text-indigo-800";
      case "chat": return "bg-pink-100 text-pink-800";
      case "laporan": return "bg-red-100 text-red-800";
      case "admin": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityLabel = (type) => {
    switch (type) {
      case "produk": return "Produk";
      case "transaksi": return "Transaksi";
      case "pengguna": return "Pengguna";
      case "chat": return "Chat";
      case "laporan": return "Laporan";
      case "admin": return "Admin";
      default: return "Lainnya";
    }
  };

  const filterOptions = [
    { value: "semua", label: "Semua Aktivitas" },
    { value: "produk", label: "Produk" },
    { value: "transaksi", label: "Transaksi" },
    { value: "pengguna", label: "Pengguna" },
    { value: "chat", label: "Chat" },
    { value: "laporan", label: "Laporan" },
    { value: "admin", label: "Admin" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Aktivitas Terbaru</h2>
          <p className="text-sm text-gray-600 mt-1">
            {pagination.total || activities.length} aktivitas ditemukan
          </p>
        </div>
        <div className="flex gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A] mx-auto mb-4"></div>
            Memuat aktivitas...
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">
            <p>Terjadi kesalahan: {error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-4"
            >
              Refresh Halaman
            </Button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Tidak ada aktivitas yang sesuai filter.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredActivities.map((activity) => (
              <li key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  <span
                    className={`w-[79px] px-2 py-1 rounded-full text-xs font-medium text-center ${getActivityColor(activity.type)}`}
                  >
                    {getActivityLabel(activity.type)}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.created_at_human}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
