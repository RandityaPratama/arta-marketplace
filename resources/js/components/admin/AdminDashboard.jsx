// src/pages/admin/AdminDashboard.js
import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button"

export default function AdminDashboard() {
  // ✅ Data statistik yang relevan (tanpa pendapatan)
  const stats = [
    { title: "Total Pengguna", value: "1,248", change: "+12% dari bulan lalu" },
    { title: "Produk Aktif", value: "3,562", change: "+8% dari bulan lalu" },
    { title: "Produk Terjual", value: "842", change: "+15% dari bulan lalu" },
    { title: "Pengguna Aktif (Minggu Ini)", value: "428", change: "+5% dari minggu lalu" },
  ];

  const recentActivity = [
    { id: 1, action: "Randitya mengunggah produk baru", time: "2 jam lalu" },
    { id: 2, action: "Budi membeli Samsung S24 Ultra", time: "5 jam lalu" },
    { id: 3, action: "Dina memperbarui profil", time: "1 hari lalu" },
    { id: 4, action: "Eko memberi ulasan", time: "1 hari lalu" },
  ];

  return (
    <AdminLayout active="Dashboard">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

        {/* Stats Cards — TANPA PENDAPATAN */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 text-sm">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
              <p className="text-xs text-green-600 mt-2 font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Ringkasan Aktivitas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aktivitas Terbaru */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#1E3A8A] rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-800 text-sm">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Produk Terbaru */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Produk Terbaru</h3>
              <Button variant="outline" size="sm">Lihat Semua</Button>
            </div>
            <div className="space-y-4">
              {[
                { name: "Samsung S24 Ultra", seller: "Randitya", time: "2 jam lalu" },
                { name: "Kursi Gaming", seller: "Budi", time: "5 jam lalu" },
                { name: "Sepatu Nike", seller: "Dina", time: "1 hari lalu" },
              ].map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-600">Oleh {product.seller}</p>
                  </div>
                  <span className="text-xs text-gray-500">{product.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}