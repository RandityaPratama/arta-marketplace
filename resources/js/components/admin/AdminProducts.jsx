// src/pages/admin/AdminDashboard.js
import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button"

export default function AdminProducts() {
  const [activeTab, setActiveTab] = useState("menunggu"); // default: menunggu persetujuan

  // Data dummy dengan semua status
  const [products] = useState([
    {
      id: 1,
      name: "Samsung S24 Ultra",
      seller: "Randitya Pratama",
      category: "Elektronik",
      price: "12.000.000",
      location: "Surabaya",
      uploadedAt: "2 jam lalu",
      status: "menunggu",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      seller: "Budi Santoso",
      category: "Elektronik",
      price: "15.500.000",
      location: "Bandung",
      uploadedAt: "1 minggu lalu",
      status: "aktif",
    },
    {
      id: 3,
      name: "Kursi Gaming",
      seller: "Dina Putri",
      category: "Furnitur",
      price: "2.300.000",
      location: "Yogyakarta",
      uploadedAt: "3 hari lalu",
      status: "terjual",
    },
    {
      id: 4,
      name: "Laptop ASUS Curian",
      seller: "Andi",
      category: "Elektronik",
      price: "8.000.000",
      location: "Jakarta",
      uploadedAt: "5 jam lalu",
      status: "dilaporkan",
    },
    {
      id: 5,
      name: "Sepatu Nike KW",
      seller: "Eko",
      category: "Fashion",
      price: "500.000",
      location: "Surabaya",
      uploadedAt: "2 minggu lalu",
      status: "dihapus",
    },
    {
      id: 6,
      name: "HP Android Rusak",
      seller: "Fani",
      category: "Elektronik",
      price: "300.000",
      location: "Bandung",
      uploadedAt: "4 hari lalu",
      status: "ditolak",
    },
  ]);

  // Fungsi aksi
  const handleApprove = (id) => {
    alert(`Produk ID ${id} telah disetujui dan aktif!`);
  };

  const handleReject = (id) => {
    const reason = prompt("Alasan penolakan:");
    alert(`Produk ID ${id} ditolak. Alasan: ${reason || "-"}`);
  };

  const handleHide = (id) => {
    alert(`Produk ID ${id} disembunyikan (dihapus)!`);
  };

  const handleDeleteReported = (id) => {
    alert(`Produk ID ${id} dihapus permanen!`);
  };

  const handleRestore = (id) => {
    alert(`Produk ID ${id} dipulihkan ke status "Aktif"!`);
  };

  // Filter produk berdasarkan tab
  const filteredProducts = products.filter(product => {
    if (activeTab === "semua") return true;
    return product.status === activeTab;
  });

  // Label status untuk tampilan
  const getStatusBadge = (status) => {
    const config = {
      menunggu: { text: "Menunggu", bg: "bg-yellow-100", textC: "text-yellow-800" },
      aktif: { text: "Aktif", bg: "bg-green-100", textC: "text-green-800" },
      terjual: { text: "Terjual", bg: "bg-blue-100", textC: "text-blue-800" },
      dilaporkan: { text: "Dilaporkan", bg: "bg-red-100", textC: "text-red-800" },
      dihapus: { text: "Dihapus", bg: "bg-gray-100", textC: "text-gray-800" },
      ditolak: { text: "Ditolak", bg: "bg-red-100", textC: "text-red-800" },
    };
    const { text, bg, textC } = config[status] || config.menunggu;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${bg} ${textC}`}>
        {text}
      </span>
    );
  };

  // Tombol aksi sesuai status
  const renderActions = (product) => {
    switch (product.status) {
      case "menunggu":
        return (
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={() => handleApprove(product.id)}>
              Setujui
            </Button>
            <Button variant="danger" size="sm" onClick={() => handleReject(product.id)}>
              Tolak
            </Button>
          </div>
        );
      case "aktif":
        return (
          <Button variant="danger" size="sm" onClick={() => handleHide(product.id)}>
            Sembunyikan
          </Button>
        );
      case "dilaporkan":
        return (
          <div className="flex gap-2">
            <Button variant="danger" size="sm" onClick={() => handleDeleteReported(product.id)}>
              Hapus
            </Button>
            <Button variant="primary" size="sm" onClick={() => handleRestore(product.id)}>
              Pulihkan
            </Button>
          </div>
        );
      default:
        return (
          <span className="text-gray-500 text-sm">Tidak ada aksi</span>
        );
    }
  };

  return (
    <AdminLayout active="Produk">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Cari produk..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
        </div>

        {/* Tab Filter */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          {[
            { id: "semua", label: "Semua" },
            { id: "menunggu", label: "Menunggu Persetujuan" },
            { id: "aktif", label: "Aktif" },
            { id: "terjual", label: "Terjual" },
            { id: "dilaporkan", label: "Dilaporkan" },
            { id: "dihapus", label: "Dihapus" },
            { id: "ditolak", label: "Ditolak" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Daftar Produk */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Tidak ada produk dalam status ini.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diunggah</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <span className="text-xs text-gray-500">ID: {product.id}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{product.seller}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-[#DDE7FF] text-[#1E3A8A] rounded-full text-xs">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">Rp. {product.price}</td>
                    <td className="px-6 py-4">{getStatusBadge(product.status)}</td>
                    <td className="px-6 py-4 text-gray-700">{product.uploadedAt}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {renderActions(product)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}