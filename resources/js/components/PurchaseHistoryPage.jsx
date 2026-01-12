    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background";
    import { useReports } from "../components/context/ReportContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '/storage');

    const formatPrice = (price) => {
      if (price === undefined || price === null) return "";
      return Number(price).toLocaleString('id-ID');
    };

    export default function PurchaseHistoryPage() {
    const navigate = useNavigate();
    const { submitReport, reportReasons, fetchReportReasons } = useReports();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportData, setReportData] = useState({ productId: null, productName: "", transactionId: null });
    const [selectedReasonId, setSelectedReasonId] = useState(null);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    
    if (!clientKey) {
      console.error("VITE_MIDTRANS_CLIENT_KEY tidak ditemukan. Pastikan Anda menambahkannya di file .env");
      return;
    }

    if(document.querySelector(`script[src="${snapScript}"]`)) return;

    const script = document.createElement('script');
    script.src = snapScript;
    script.setAttribute('data-client-key', clientKey);
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    }
  }, []);

  const fetchTransactions = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`${API_URL}/transactions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const result = await response.json();
      
      if (result.success) {
        setTransactions(result.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch report reasons saat modal dibuka
  useEffect(() => {
    if (isReportModalOpen && reportReasons.length === 0) {
      fetchReportReasons();
    }
  }, [isReportModalOpen, reportReasons.length, fetchReportReasons]);

    const openReportModal = (productId, productName, transactionId) => {
        setReportData({ productId, productName, transactionId });
        setSelectedReasonId(null);
        setIsReportModalOpen(true);
    };

    const submitReportForm = async () => {
        if (!selectedReasonId) {
            setNotification({ show: true, message: "Silakan pilih alasan laporan!", type: "error" });
            return;
        }
        
        try {
            await submitReport(reportData.productId, selectedReasonId, reportData.transactionId, 'transaksi');
            setIsReportModalOpen(false);
            
            setNotification({ 
                show: true, 
                message: "Laporan berhasil dikirim! Tim kami akan segera meninjau.", 
                type: "success" 
            });
        } catch (error) {
            setNotification({ show: true, message: error.message || "Gagal mengirim laporan", type: "error" });
        }
    };

    useEffect(() => {
        if (notification.show) {
        const timer = setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [notification.show]);

  const handlePay = (snapToken) => {
    if (window.snap) {
      window.snap.pay(snapToken, {
        onSuccess: function(result){
          setNotification({ show: true, message: "Pembayaran Berhasil!", type: "success" });
          fetchTransactions(); 
        },
        onPending: function(result){
          setNotification({ show: true, message: "Menunggu Pembayaran...", type: "info" });
          fetchTransactions();
        },
        onError: function(result){
          setNotification({ show: true, message: "Pembayaran Gagal!", type: "error" });
        },
        onClose: function(){
          setNotification({ show: true, message: "Popup ditutup", type: "info" });
        }
      });
    } else {
      setNotification({ show: true, message: "Sistem pembayaran belum siap. Refresh halaman.", type: "error" });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'settlement':
      case 'capture':
        return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Berhasil</span>;
      case 'pending':
        return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Menunggu Pembayaran</span>;
      case 'deny':
      case 'cancel':
      case 'expire':
        return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Gagal / Kadaluarsa</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Riwayat Pembelian</h1>
                <p className="text-sm text-gray-600 mt-1">
            {transactions.length} transaksi
                </p>
                </div>
                <Button variant="primary" size="md" onClick={() => navigate(-1)}>
                Kembali
                </Button>
            </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat riwayat transaksi...</div>
      ) : transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                Belum ada riwayat pembelian.
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-xl shadow-[0px_4px_11px_rgba(0,0,0,0.07)] overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penjual</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Harga</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
            {transactions.map((trx) => (
              <tr key={trx.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                      {trx.product?.images && trx.product.images.length > 0 ? (
                        <img src={`${STORAGE_URL}/${trx.product.images[0]}`} alt={trx.product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-xs font-medium text-gray-500">Foto</span>
                      )}
                            </div>
                            <div>
                      <div className="font-medium text-gray-900">{trx.product?.name || 'Produk Dihapus'}</div>
                      <span className="text-xs text-gray-500">Order ID: {trx.order_id}</span>
                            </div>
                            </div>
                        </td>
                <td className="px-6 py-4 text-gray-700">{trx.seller?.name || 'Unknown'}</td>
                <td className="px-6 py-4 font-medium">Rp. {formatPrice(trx.amount)}</td>
                <td className="px-6 py-4 text-gray-700">
                  {new Date(trx.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </td>
                        <td className="px-6 py-4">
                  {getStatusBadge(trx.status)}
                        </td>
                        <td className="px-6 py-4">
                  {trx.status === 'pending' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handlePay(trx.snap_token)}
                    >
                      Bayar
                    </Button>
                  ) : (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => openReportModal(trx.product_id, trx.product?.name, trx.id)}
                      className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Laporkan
                    </Button>
                  )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            )}
            </div>

            {/* Modal Laporan dengan Upload Foto */}
            {isReportModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Laporkan Produk: {reportData.productName}
                </h3>
                
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pilih Alasan Laporan <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {reportReasons.length === 0 ? (
                            <p className="text-sm text-gray-500">Memuat alasan...</p>
                        ) : (
                            reportReasons.map((reason) => (
                                <div
                                    key={reason.id}
                                    className={`p-3 border rounded-lg cursor-pointer ${
                                        selectedReasonId === reason.id
                                        ? "border-[#1E3A8A] bg-[#F0F7FF]"
                                        : "border-gray-300 hover:bg-gray-50"
                                    }`}
                                    onClick={() => setSelectedReasonId(reason.id)}
                                >
                                    <span className="text-gray-800 text-sm">{reason.reason}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIsReportModalOpen(false)}
                    className="flex-1"
                    >
                    Batal
                    </Button>
                    <Button
                    variant="danger"
                    size="md"
                    onClick={submitReportForm}
                    className="flex-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                    >
                    Kirim Laporan
                    </Button>
                </div>
                </div>
            </div>
            )}

            {/* POPUP NOTIFIKASI */}
            {notification.show && (
            <div 
                className="fixed top-4 right-4 z-50 max-w-xs p-4 rounded-lg shadow-lg text-white animate-fade-in"
                style={{ backgroundColor: notification.type === "success" ? "#10B981" : "#EF4444" }}
                onClick={() => setNotification({ show: false, message: "", type: "" })}
            >
                <div className="flex items-start gap-3">
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={2} 
                    stroke="currentColor" 
                    className="w-5 h-5"
                >
                    {notification.type === "success" ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                </svg>
                <p className="text-sm">{notification.message}</p>
                </div>
            </div>
            )}
        </Background>
        <Footer />
        </>
    );
    }