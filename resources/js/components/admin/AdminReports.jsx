// src/pages/admin/AdminReports.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import Button from "../ui/Button";

export default function AdminReports() {
  const [activeTab, setActiveTab] = useState("iklan");
  
  // Laporan Iklan
  const [adReports, setAdReports] = useState([
    { 
      id: 1, 
      product: "iPhone 15 Curian", 
      reporter: "Andi", 
      reportedDate: "2 jam lalu", 
      reason: "Barang ilegal", 
      status: "Menunggu",
      productImage: "https://via.placeholder.com/60x60?text=iPhone15"
    },
    { 
      id: 2, 
      product: "Laptop ASUS Palsu", 
      reporter: "Budi", 
      reportedDate: "5 jam lalu", 
      reason: "Deskripsi menipu", 
      status: "Diproses",
      productImage: "https://via.placeholder.com/60x60?text=Laptop"
    },
    { 
      id: 3, 
      product: "Sepatu Nike KW", 
      reporter: "Citra", 
      reportedDate: "1 hari lalu", 
      reason: "Foto tidak sesuai", 
      status: "Selesai",
      productImage: "https://via.placeholder.com/60x60?text=Sepatu"
    },
  ]);

  // Laporan Pembelian
  const [purchaseReports, setPurchaseReports] = useState([
    { 
      id: 4, 
      product: "Samsung S24 Ultra", 
      buyer: "Randitya", 
      seller: "Budi Santoso",
      reportedDate: "1 jam lalu", 
      reason: "Barang rusak parah saat diterima. Layar retak dan casing penyok. Tidak sesuai dengan deskripsi 'kondisi mulus'.", 
      evidenceImages: [
        "https://via.placeholder.com/40x40?text=Rusak",
        "https://via.placeholder.com/40x40?text=Chat"
      ],
      status: "Menunggu",
      purchaseDate: "12 Des 2025",
      productImage: "https://via.placeholder.com/60x60?text=Samsung"
    },
    { 
      id: 5, 
      product: "Kursi Gaming", 
      buyer: "Dina Putri", 
      seller: "Andi Wijaya",
      reportedDate: "3 jam lalu", 
      reason: "Penjual tidak merespon setelah pembayaran. Barang tidak dikirim selama 3 hari.", 
      evidenceImages: [
        "https://via.placeholder.com/40x40?text=Chat1",
        "https://via.placeholder.com/40x40?text=Chat2"
      ],
      status: "Diproses",
      purchaseDate: "10 Des 2025",
      productImage: "https://via.placeholder.com/60x60?text=Kursi"
    },
    { 
      id: 6, 
      product: "Adidas Adizero", 
      buyer: "Eko", 
      seller: "Dina Putri",
      reportedDate: "1 hari lalu", 
      reason: "Ukuran sepatu tidak sesuai pesanan. Saya pesan ukuran 42, yang datang ukuran 39.", 
      evidenceImages: [
        "https://via.placeholder.com/40x40?text=Ukuran"
      ],
      status: "Selesai",
      purchaseDate: "8 Des 2025",
      productImage: "https://via.placeholder.com/60x60?text=Adidas"
    },
  ]);

  const [fullReason, setFullReason] = useState("");
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false);

  // Fungsi handle (tetap sama)
  const handleHideAd = (reportId) => {
    if (window.confirm("Sembunyikan iklan ini?")) {
      alert("Iklan disembunyikan!");
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

  const handleResolveAd = (reportId) => {
    setAdReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "Selesai" }
          : report
      )
    );
  };

  const handleWarnSeller = (reportId) => {
    alert("Peringatan dikirim!");
    setPurchaseReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "Selesai" }
          : report
      )
    );
  };

  const handleBanSeller = (reportId) => {
    if (window.confirm("Ban akun penjual?")) {
      alert("Akun di-ban!");
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

  const handleResolvePurchase = (reportId) => {
    setPurchaseReports(prev => 
      prev.map(report => 
        report.id === reportId 
          ? { ...report, status: "Selesai" }
          : report
      )
    );
  };

  const openReasonModal = (reason) => {
    setFullReason(reason);
    setIsReasonModalOpen(true);
  };

  const currentReports = activeTab === "iklan" ? adReports : purchaseReports;
  const isAdTab = activeTab === "iklan";

  // ✅ Potong jadi 25 karakter
  const truncateReason = (text) => {
    if (text.length <= 25) return text;
    return text.substring(0, 25);
  };

  return (
    <AdminLayout active="Laporan">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Pelanggaran</h2>

        {/* Tab */}
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
          <table className="w-full min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Produk</th>
                {isAdTab ? (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Pelapor</th>
                ) : (
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Pembeli</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Penjual</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Beli</th>
                  </>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Tanggal Lapor</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                {!isAdTab && (
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Bukti</th>
                )}
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Aksi</th>
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
                  
                  {/* ✅ Alasan: Hanya 25 karakter + selengkapnya */}
                  <td className="px-4 py-4 text-gray-700 text-sm">
                    <div>
                      <span>{truncateReason(report.reason)}</span>
                      {report.reason.length > 25 && (
                        <button
                          onClick={() => openReasonModal(report.reason)}
                          className="ml-1 text-[#1E3A8A] hover:underline text-xs"
                        >
                          ...
                        </button>
                      )}
                    </div>
                  </td>
                  
                  {!isAdTab && (
                    <td className="px-4 py-4">
                      <div className="flex gap-1.5">
                        {report.evidenceImages.map((img, idx) => (
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
                        <>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleHideAd(report.id)}
                            className="text-[11px] px-2 py-1 h-7"
                          >
                            Sembunyikan
                          </Button>
                          {report.status === "Menunggu" && (
                            <Button
                              variant="primary"
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
                        <>
                          {report.status === "Menunggu" && (
                            <div className="flex gap-1.5">
                              <Button
                                variant="primary"
                                size="sm"
                                onClick={() => handleProcessPurchase(report.id)}
                                className="text-[11px] px-2 py-1 h-7"
                              >
                                Proses
                              </Button>
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleWarnSeller(report.id)}
                                className="text-[11px] px-2 py-1 h-7 bg-orange-100 text-orange-800 hover:bg-orange-200"
                              >
                                ⚠️
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleBanSeller(report.id)}
                                className="text-[11px] px-2 py-1 h-7"
                              >
                                🚫
                              </Button>
                            </div>
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

        {/* Modal Alasan Lengkap */}
        {isReasonModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">Alasan Laporan</h3>
                <button
                  onClick={() => setIsReasonModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                {fullReason}
              </p>
              <div className="mt-4 text-right">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsReasonModalOpen(false)}
                  className="px-4 py-2"
                >
                  Tutup
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}