// components/admin/AdminReports.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Button from "../ui/Button";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '');

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("iklan");
  const [adReports, setAdReports] = useState([]);
  const [purchaseReports, setPurchaseReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getToken = () => localStorage.getItem('adminToken');

  // ✅ Fetch laporan iklan dari database
  useEffect(() => {
    fetchAdReports();
  }, [statusFilter, searchQuery]);

  const fetchAdReports = async () => {
    const token = getToken();
    if (!token) return;

    setLoading(true);
    try {
      let url = `${API_URL}/admin/reports?`;
      if (statusFilter !== "all") {
        url += `status=${statusFilter}&`;
      }
      if (searchQuery) {
        url += `search=${encodeURIComponent(searchQuery)}&`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        const formattedReports = result.data.map(report => ({
          id: report.id,
          product: report.product.name,
          productId: report.product.id,
          reporter: report.reporter.name,
          reporterEmail: report.reporter.email,
          seller: report.seller.name,
          sellerId: report.seller.id,
          reportedDate: new Date(report.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          }),
          reason: report.reason,
          status: report.status === 'pending' ? 'Menunggu' :
                  report.status === 'in_progress' ? 'Diproses' :
                  report.status === 'resolved' ? 'Selesai' : 'Ditolak',
          statusRaw: report.status,
          productImage: report.product.images && report.product.images.length > 0
            ? `${STORAGE_URL}/${report.product.images[0]}`
            : "https://via.placeholder.com/60x60?text=No+Image",
          adminNotes: report.admin_notes,
          handledBy: report.handler?.name,
          handledAt: report.handled_at
        }));
        setAdReports(formattedReports);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fungsi untuk laporan iklan
  const handleHideAd = async (reportId) => {
    if (!window.confirm("Hapus iklan ini secara permanen?")) return;

    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/product`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        alert("Iklan telah dihapus!");
        fetchAdReports(); // Refresh data
      } else {
        alert(result.message || "Gagal menghapus iklan");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan saat menghapus iklan");
    }
  };

  const handleBanSellerFromAd = async (reportId) => {
    if (!window.confirm("Ban akun penjual ini secara permanen?")) return;

    // TODO: Implement ban seller API
    alert("Fitur ban akun akan segera tersedia");
  };

  const handleProcessAd = async (reportId) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          status: 'in_progress',
          admin_notes: 'Laporan sedang ditinjau'
        })
      });
      const result = await response.json();

      if (result.success) {
        fetchAdReports(); // Refresh data
      } else {
        alert(result.message || "Gagal memproses laporan");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat memproses laporan");
    }
  };

  const handleResolveAd = async (reportId) => {
    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          status: 'resolved',
          admin_notes: 'Laporan telah diselesaikan'
        })
      });
      const result = await response.json();

      if (result.success) {
        fetchAdReports(); // Refresh data
      } else {
        alert(result.message || "Gagal menyelesaikan laporan");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat menyelesaikan laporan");
    }
  };

  // ✅ Fungsi untuk laporan pembelian (placeholder - belum diimplementasi)
  const handleBanSellerFromPurchase = (reportId) => {
    alert("Fitur laporan pembelian akan segera tersedia");
  };

  const handleProcessPurchase = (reportId) => {
    alert("Fitur laporan pembelian akan segera tersedia");
  };

  const handleResolvePurchase = (reportId) => {
    alert("Fitur laporan pembelian akan segera tersedia");
  };

  const currentReports = activeTab === "iklan" ? adReports : purchaseReports;
  const isAdTab = activeTab === "iklan";

  return (
    <AdminLayout active="Laporan">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Pelanggaran</h2>

        {/* Filter & Search */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Cari produk, pelapor, atau penjual..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="in_progress">Diproses</option>
            <option value="resolved">Selesai</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("iklan")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "iklan"
                ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Laporan Iklan
          </button>
          <button
            onClick={() => setActiveTab("pembelian")}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "pembelian"
                ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Laporan Pembelian
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Memuat laporan...</div>
        ) : currentReports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {activeTab === "iklan" ? "Belum ada laporan iklan" : "Belum ada laporan pembelian"}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                {isAdTab ? (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pembeli</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Beli</th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Lapor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                {!isAdTab && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bukti</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded overflow-hidden">
                        <img 
                          src={report.productImage} 
                          alt={report.product}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="max-w-[140px]">
                        <div className="font-medium text-gray-900 text-sm">{report.product}</div>
                      </div>
                    </div>
                  </td>
                  {isAdTab ? (
                    <td className="px-4 py-4 text-gray-700 text-sm">{report.reporter}</td>
                  ) : (
                    <>
                      <td className="px-4 py-4 text-gray-700 text-sm">{report.buyer}</td>
                      <td className="px-4 py-4 text-gray-700 text-sm">{report.seller}</td>
                      <td className="px-4 py-4 text-gray-700 text-sm">{report.purchaseDate}</td>
                    </>
                  )}
                  <td className="px-4 py-4 text-gray-700 text-sm">{report.reportedDate}</td>
                  <td className="px-4 py-4 text-gray-700 text-sm max-w-md">
                    {report.reason.length > 50 ? (
                      <>
                        <span>{report.reason.substring(0, 50)}...</span>
                        <button
                          onClick={() => alert(report.reason)}
                          className="ml-1 text-[#1E3A8A] hover:underline text-xs"
                        >
                          selengkapnya
                        </button>
                      </>
                    ) : (
                      report.reason
                    )}
                  </td>
                  {!isAdTab && (
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5">
                        {report.evidenceImages?.map((img, idx) => (
                          <div key={idx} className="w-10 h-10 bg-gray-200 rounded overflow-hidden">
                            <img 
                              src={img} 
                              alt={`Bukti ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      report.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                      report.status === "Diproses" ? "bg-blue-100 text-blue-800" :
                      "bg-green-100 text-green-800"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {isAdTab ? (
                        // ✅ Laporan Iklan: Hapus Iklan + Ban Akun
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleHideAd(report.id)}
                            className="text-[11px] px-2 py-1 h-7 "
                          >
                            Hapus Iklan
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleBanSellerFromAd(report.id)}
                            className="text-[11px] px-2 py-1 h-7 "
                          >
                            Ban Akun
                          </Button>
                          {report.status === "Menunggu" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProcessAd(report.id)}
                              className="text-[11px] px-2 py-1 h-7"
                            >
                              Proses
                            </Button>
                          )}
                          {report.status === "Diproses" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveAd(report.id)}
                              className="text-[11px] px-2 py-1 h-7"
                            >
                              Selesai
                            </Button>
                          )}
                        </>
                      ) : (
                        // ✅ Laporan Pembelian: Hanya Ban Akun
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleBanSellerFromPurchase(report.id)}
                            className="text-[11px] px-2 py-1 h-7 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            Ban Akun
                          </Button>
                          {report.status === "Menunggu" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProcessPurchase(report.id)}
                              className="text-[11px] px-2 py-1 h-7"
                            >
                              Proses
                            </Button>
                          )}
                          {report.status === "Diproses" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolvePurchase(report.id)}
                              className="text-[11px] px-2 py-1 h-7"
                            >
                              Selesai
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </AdminLayout>
  );
}