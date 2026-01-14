import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../ui/Button";
import { useAdminProduct } from "./admincontext/AdminProductContext";

export default function AdminProductsContentOnly() {
  const navigate = useNavigate();
  const location = useLocation();

  const getDefaultTab = () => {
    if (location.state?.defaultTab) {
      return location.state.defaultTab;
    }
    return "menunggu";
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab);
  const { products, loading, fetchProducts, approveProduct, rejectProduct, hideProduct } = useAdminProduct();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [location.state]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts(activeTab, 1, searchTerm);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [activeTab, searchTerm, fetchProducts]);

  const handleApprove = async (id) => {
    const result = await approveProduct(id);
    if (result.success) alert("Produk berhasil disetujui!");
  };

  const handleReject = async (id) => {
    const reason = prompt("Alasan penolakan:");
    if (reason) {
      const result = await rejectProduct(id, reason);
      if (result.success) alert("Produk berhasil ditolak.");
    }
  };

  const handleHide = async (id) => {
    if (confirm("Sembunyikan produk ini?")) {
      const result = await hideProduct(id);
      if (result.success) alert("Produk berhasil disembunyikan.");
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      menunggu: { text: "Menunggu", bg: "bg-yellow-100", textC: "text-yellow-800" },
      aktif: { text: "Aktif", bg: "bg-green-100", textC: "text-green-800" },
      terjual: { text: "Terjual", bg: "bg-blue-100", textC: "text-blue-800" },
      ditolak: { text: "Ditolak", bg: "bg-red-100", textC: "text-red-800" },
    };
    const { text, bg, textC } = config[status] || config.menunggu;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${bg} ${textC}`}>
        {text}
      </span>
    );
  };

  const renderActions = (product) => {
    switch (product.status) {
      case "menunggu":
        return (
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleApprove(product.id)}
              className="text-[11px] px-2 py-1 h-7 mr-1"
            >
              Setujui
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleReject(product.id)}
              className="text-[11px] px-2 py-1 h-7"
            >
              Tolak
            </Button>
          </>
        );
      case "aktif":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleHide(product.id)}
            className="text-[11px] px-2 py-1 h-7 border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            Sembunyikan
          </Button>
        );
      default:
        return null;
    }
  };

  const productTabs = [
    { id: "menunggu", label: "Menunggu" },
    { id: "aktif", label: "Aktif" },
    { id: "terjual", label: "Terjual" },
    { id: "ditolak", label: "Ditolak" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Produk</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari produk..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
          <Button variant="primary" size="md" onClick={() => fetchProducts(activeTab, 1, searchTerm)}>Cari</Button>
        </div>
      </div>

      {/* Product Status Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {productTabs.map((tab) => (
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat data produk...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Tidak ada produk ditemukan.</div>
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
              {products.map((product) => (
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
  );
}
