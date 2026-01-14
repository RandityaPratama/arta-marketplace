import React, { useState, useEffect } from "react";
import Button from "../ui/Button";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage');

export default function AdminReportsContentOnly() {
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
        if (activeTab === 'iklan') {
          setAdReports(result.data);
        } else {
          setPurchaseReports(result.data);
        }
      }
    } catch (err) {
      setError('Terjadi kesalahan saat mengambil data laporan');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveReport = async (id) => {
    // Implement resolve logic
    alert('Fitur selesaikan laporan akan diimplementasikan');
  };

  const handleRejectReport = async (id) => {
    // Implement reject logic
    alert('Fitur tolak laporan akan diimplementasikan');
  };

  const handleBlockSeller = async (id) => {
    // Implement block logic
    alert('Fitur ban akun akan diimplementasikan');
  };

  const handleProcessReport = async (id) => {
    // Implement process logic
    alert('Fitur proses laporan akan diimplementasikan');
  };

  const reports = activeTab === 'iklan' ? adReports : purchaseReports;

  const reportTabs = [
    { id: "iklan", label: "Laporan Iklan" },
    { id: "transaksi", label: "Laporan Transaksi" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Laporan</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari laporan..."
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
          >
            <option value="all">Semua Status</option>
            <option value="Menunggu">Menunggu</option>
            <option value="Diproses">Diproses</option>
            <option value="Selesai">Selesai</option>
          </select>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {reportTabs.map((tab) => (
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
          <div className="text-center py-12 text-gray-500">Memuat data laporan...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
        ) : reports.length === 0 ? (
          <div className="text-center py-12 text-gray-500">Tidak ada laporan ditemukan.</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{report.product?.name || 'N/A'}</div>
                    <span className="text-xs text-gray-500">ID: {report.id}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{report.reporter?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-gray-700">{report.reason}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      report.status === "Selesai" ? "bg-green-100 text-green-800" :
                      report.status === "Diproses" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{report.created_at}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {activeTab === 'iklan' ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleResolveReport(report.id)}
                          className="text-[11px] px-2 py-1 h-7 mr-1"
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
