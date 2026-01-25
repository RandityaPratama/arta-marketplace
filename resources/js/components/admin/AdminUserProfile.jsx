import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Button from "../ui/Button";
import { useAdminUser } from "./admincontext/AdminUserContext";
import { User } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage');

export default function AdminUserProfile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const { currentUser, loading, fetchUserById } = useAdminUser();
  const [activeTab, setActiveTab] = useState("iklan");

  useEffect(() => {
    if (userId) {
      fetchUserById(userId);
    }
  }, [userId, fetchUserById]);

  if (loading) {
    return (
      <AdminLayout active="Pengguna">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Memuat data pengguna...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!currentUser) {
    return (
      <AdminLayout active="Pengguna">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Pengguna tidak ditemukan</div>
        </div>
      </AdminLayout>
    );
  }

  const { user, listings, purchases } = currentUser;
  const userInitial = user.name?.charAt(0).toUpperCase() || "U";

  return (
    <AdminLayout active="Pengguna">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Profil Pengguna</h2>
          <Button variant="primary" size="md" onClick={() => navigate("/admin/users")}>
            Kembali ke Daftar
          </Button>
        </div>

        {/* User Info Card with Avatar */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-[#DDE7FF] rounded-full flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#1E3A8A] font-bold text-3xl">
                    {userInitial}
                  </span>
                )}
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Informasi Pengguna</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nomor Telepon</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Lokasi</p>
                  <p className="font-medium">{user.location}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status Akun</p>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.status === "Aktif" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {user.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bergabung Sejak</p>
                  <p className="font-medium">{user.joined}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("iklan")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "iklan"
                ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Iklan yang Dipasang ({listings?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab("pembelian")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "pembelian"
                ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Produk yang Dibeli ({purchases?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "iklan" ? (
          <div>
            {!listings || listings.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-500">Pengguna ini belum memiliki iklan.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dipublikasikan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.map((product) => {
                      const imageUrl = product.image 
                        ? `${STORAGE_URL}/${product.image}`
                        : "https://via.placeholder.com/60x60?text=No+Image";

                      return (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={imageUrl} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-[#DDE7FF] text-[#1E3A8A] rounded-full text-xs">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">Rp. {product.price}</td>
                          <td className="px-6 py-4 text-gray-700">{product.publishedAt}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              product.status === "Aktif" ? "bg-green-100 text-green-800" :
                              product.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {product.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div>
            {!purchases || purchases.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <p className="text-gray-500">Pengguna ini belum membeli produk.</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Beli</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {purchases.map((purchase) => {
                      const imageUrl = purchase.image 
                        ? `${STORAGE_URL}/${purchase.image}`
                        : "https://via.placeholder.com/60x60?text=No+Image";

                      return (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <img 
                                  src={imageUrl} 
                                  alt={purchase.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="font-medium text-gray-900">{purchase.productName}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{purchase.seller}</td>
                          <td className="px-6 py-4">Rp. {purchase.price}</td>
                          <td className="px-6 py-4 text-gray-700">{purchase.purchaseDate}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              purchase.status === "Diterima" ? "bg-green-100 text-green-800" :
                              purchase.status === "Dikirim" ? "bg-blue-100 text-blue-800" :
                              "bg-yellow-100 text-yellow-800"
                            }`}>
                              {purchase.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
