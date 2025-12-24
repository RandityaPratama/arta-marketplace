// components/admin/AdminReports.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Button from "../ui/Button";

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("iklan");
  const [adReports, setAdReports] = useState([]);
  const [purchaseReports, setPurchaseReports] = useState([]);

  // ✅ Baca laporan dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("product_reports");
    if (saved) {
      const reports = JSON.parse(saved);
      const adReportsFromStorage = reports
        .filter(r => r.type === "iklan")
        .map(r => ({
          id: r.id,
          product: r.productName,
          reporter: "Pengguna",
          reportedDate: r.reportedAt,
          reason: r.reason,
          status: r.status || "Menunggu",
          productImage: "https://via.placeholder.com/60x60?text=Product",
          sellerId: r.sellerId || 100 // ✅ Simpan ID penjual
        }));
      setAdReports(adReportsFromStorage);

      const purchaseReportsFromStorage = reports
        .filter(r => r.type === "pembelian")
        .map(r => ({
          id: r.id,
          product: r.productName,
          buyer: r.buyer || "Pembeli",
          seller: r.sellerName || "Penjual",
          reportedDate: r.reportedAt,
          reason: r.reason,
          evidenceImages: r.evidenceImages || [],
          status: r.status || "Menunggu",
          purchaseDate: r.purchaseDate || "1 Jan 2025",
          productImage: "https://via.placeholder.com/60x60?text=Product",
          sellerId: r.sellerId || 100 // ✅ Simpan ID penjual
        }));
      setPurchaseReports(purchaseReportsFromStorage);
    }
  }, []);

  // ✅ Fungsi untuk laporan iklan
  const handleHideAd = (reportId) => {
    if (window.confirm("Hapus iklan ini secara permanen?")) {
      alert("Iklan telah dihapus!");
      setAdReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: "Selesai" }
            : report
        )
      );
    }
  };

  const handleBanSellerFromAd = (reportId) => {
    if (window.confirm("Ban akun penjual ini secara permanen?")) {
      alert("Akun penjual telah di-ban!");
      setAdReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: "Selesai" }
            : report
        )
      );
    }
  };

  const handleProcessAd = (reportId) => {
    setAdReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "Diproses" }
          : report
      )
    );
  };

  // ✅ Fungsi untuk laporan pembelian
  const handleBanSellerFromPurchase = (reportId) => {
    if (window.confirm("Ban akun penjual ini secara permanen?")) {
      alert("Akun penjual telah di-ban!");
      setPurchaseReports(prev => 
        prev.map(report => 
          report.id === reportId 
            ? { ...report, status: "Selesai" }
            : report
        )
      );
    }
  };

  const handleProcessPurchase = (reportId) => {
    setPurchaseReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "Diproses" }
          : report
      )
    );
  };

  const currentReports = activeTab === "iklan" ? adReports : purchaseReports;
  const isAdTab = activeTab === "iklan";

  return (
    <AdminLayout active="Laporan">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Pelanggaran</h2>

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
      </div>
    </AdminLayout>
  );
}