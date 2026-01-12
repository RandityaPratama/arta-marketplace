import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Button from "../ui/Button";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage');

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("iklan");
  const [adReports, setAdReports] = useState([]);
  const [purchaseReports, setPurchaseReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getToken = () => localStorage.getItem('admin_token');

  useEffect(() => {
    fetchReports();
  }, [statusFilter, searchQuery, activeTab]);

  const fetchReports = async () => {
    const token = getToken();
    
    
    if (!token) {
      setError('Sesi Anda telah berakhir. Silakan login kembali.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const type = activeTab === 'iklan' ? 'iklan' : 'transaksi';
      let url = `${API_URL}/admin/reports?type=${type}&`;
      
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

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          const errorText = await response.text();
        }
        
        if (response.status === 401) {
          setError('Sesi Anda telah berakhir. Silakan login kembali.');
        } else {
          setError(errorMessage);
        }
        return;
      }

      const result = await response.json();

      if (result.success) {
        const formattedReports = result.data.map(report => {
          const imageUrl = report.product?.images && report.product.images.length > 0
            ? `${STORAGE_URL}/${report.product.images[0]}` 
            : "https://via.placeholder.com/60x60?text=No+Image";
          
          return {
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
            reason: report.report_reason?.reason || report.reason || '-',
            status: report.status === 'pending' ? 'Menunggu' :
                    report.status === 'in_progress' ? 'Diproses' :
                    report.status === 'resolved' ? 'Selesai' : 'Ditolak',
            statusRaw: report.status,
            productImage: imageUrl,
            adminNotes: report.admin_notes,
            handledBy: report.handler?.name,
            handledAt: report.handled_at,
            transactionId: report.transaction_id,
            buyer: report.reporter?.name,
            purchaseDate: report.transaction ? new Date(report.transaction.created_at).toLocaleDateString('id-ID') : '-',
            transactionStatus: report.transaction?.status || '-'
          };
        });
        
        if (activeTab === 'iklan') {
          setAdReports(formattedReports);
        } else {
          setPurchaseReports(formattedReports);
        }
      } else {
        setError(result.message || 'Gagal memuat laporan');
      }
    } catch (error) {
      setError(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

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
        fetchReports();
      } else {
        alert(result.message || "Gagal menghapus iklan");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Terjadi kesalahan saat menghapus iklan");
    }
  };

  const handleBlockSeller = async (reportId) => {
    if (!window.confirm("Blokir akun penjual ini? Penjual tidak akan bisa login lagi.")) return;

    const token = getToken();
    try {
      const response = await fetch(`${API_URL}/admin/reports/${reportId}/block-seller`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();

      if (result.success) {
        alert("Penjual berhasil diblokir!");
        fetchReports();
      } else {
        alert(result.message || "Gagal memblokir penjual");
      }
    } catch (error) {
      console.error("Error blocking seller:", error);
      alert("Terjadi kesalahan saat memblokir penjual");
    }
  };

  const handleProcessReport = async (reportId) => {
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
        fetchReports();
      } else {
        alert(result.message || "Gagal memproses laporan");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat memproses laporan");
    }
  };

  const handleResolveReport = async (reportId) => {
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
        fetchReports();
      } else {
        alert(result.message || "Gagal menyelesaikan laporan");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Terjadi kesalahan saat menyelesaikan laporan");
    }
  };

  const handleRejectReport = async (reportId) => {
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
          status: 'rejected',
          admin_notes: 'Laporan ditolak oleh admin'
        })
      });
      const result = await response.json();

      if (result.success) {
        fetchReports();
      } else {
        alert(result.message || "Gagal menolak laporan");
      }
    } catch (error) {
      console.error("Error rejecting report:", error);
      alert("Terjadi kesalahan saat menolak laporan");
    }
  };

  const currentReports = activeTab === "iklan" ? adReports : purchaseReports;
  const isAdTab = activeTab === "iklan";

  return (
    <AdminLayout active="Laporan">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Pelanggaran</h2>

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

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E3A8A] mb-4"></div>
            <p>Memuat laporan...</p>
          </div>
        ) : currentReports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">
              {activeTab === "iklan" ? "Belum ada laporan iklan" : "Belum ada laporan pembelian"}
            </p>
            <p className="text-sm mt-2">
              {activeTab === "iklan" ? "Laporan dari user akan muncul di sini" : "Fitur laporan pembelian akan segera tersedia"}
            </p>
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
                      report.status === "Selesai" ? "bg-green-100 text-green-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {isAdTab ? (
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleHideAd(report.id)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            Hapus Iklan
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleBlockSeller(report.id)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            Blokir Akun
                          </Button>
                          {report.status === "Menunggu" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleProcessReport(report.id)}
                                className="text-[11px] px-2 py-1 h-7"
                              >
                                Proses
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectReport(report.id)}
                                className="text-[11px] px-2 py-1 h-7 border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                Tolak
                              </Button>
                            </>
                          )}
                          {report.status === "Diproses" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResolveReport(report.id)}
                                className="text-[11px] px-2 py-1 h-7"
                              >
                                Selesai
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRejectReport(report.id)}
                                className="text-[11px] px-2 py-1 h-7 border-gray-300 text-gray-600 hover:bg-gray-50"
                              >
                                Tolak
                              </Button>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleBlockSeller(report.id)}
                            className="text-[11px] px-2 py-1 h-7 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          >
                            Ban Akun
                          </Button>
                          {report.status === "Menunggu" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleProcessReport(report.id)}
                              className="text-[11px] px-2 py-1 h-7"
                            >
                              Proses
                            </Button>
                          )}
                          {report.status === "Diproses" && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResolveReport(report.id)}
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
