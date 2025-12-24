    // src/components/PurchaseHistoryPage.js
    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background";
    import { useReports } from "../components/context/ReportContext";

    // ✅ Fungsi format harga
    const formatPrice = (priceStr) => {
    if (!priceStr) return "";
    const clean = priceStr.toString().replace(/\D/g, '');
    if (!clean) return "";
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    export default function PurchaseHistoryPage() {
    const navigate = useNavigate();
    const { submitReport } = useReports();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportData, setReportData] = useState({ productId: null, productName: "" });
    const [reportReason, setReportReason] = useState("");
    const [evidenceImages, setEvidenceImages] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const [purchases] = useState([
        {
        id: 101,
        productId: 2,
        productName: "iPhone 15 Pro",
        seller: "Siti Rahayu",
        price: "15500000",
        date: "12 Desember 2025",
        status: "Diterima",
        image: "https://via.placeholder.com/60x60?text=iPhone15",
        },
        {
        id: 102,
        productId: 3,
        productName: "Kursi Gaming",
        seller: "Andi Wijaya",
        price: "2300000",
        date: "10 Desember 2025",
        status: "Dikirim",
        image: "https://via.placeholder.com/60x60?text=Chair",
        },
        {
        id: 103,
        productId: 4,
        productName: "Adidas Adizero Evo SL",
        seller: "Dina Putri",
        price: "1200000",
        date: "8 Desember 2025",
        status: "Diterima",
        image: "https://via.placeholder.com/60x60?text=Shoes",
        },
    ]);

    const openReportModal = (productId, productName) => {
        setReportData({ productId, productName });
        setReportReason("");
        setEvidenceImages([]);
        setIsReportModalOpen(true);
    };

    const handleEvidenceImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + evidenceImages.length > 3) {
        setNotification({ 
            show: true, 
            message: "Maksimal 3 foto bukti!", 
            type: "error" 
        });
        return;
        }
        const newImages = files.map(file => URL.createObjectURL(file));
        setEvidenceImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveEvidenceImage = (index) => {
        setEvidenceImages(prev => prev.filter((_, i) => i !== index));
    };

    const submitReportForm = () => {
        if (!reportReason.trim()) {
        setNotification({ show: true, message: "Alasan laporan wajib diisi!", type: "error" });
        return;
        }
        if (evidenceImages.length === 0) {
        setNotification({ show: true, message: "Harap unggah minimal 1 foto bukti!", type: "error" });
        return;
        }
        
        submitReport(reportData.productId, reportData.productName, reportReason, evidenceImages);
        setIsReportModalOpen(false);
        
        setNotification({ 
        show: true, 
        message: "Laporan berhasil dikirim! Tim kami akan segera meninjau.", 
        type: "success" 
        });
    };

    useEffect(() => {
        if (notification.show) {
        const timer = setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
        return () => clearTimeout(timer);
        }
    }, [notification.show]);

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                <h1 className="text-2xl font-bold text-gray-800">Riwayat Pembelian</h1>
                <p className="text-sm text-gray-600 mt-1">
                    {purchases.length} produk dibeli
                </p>
                </div>
                <Button variant="primary" size="md" onClick={() => navigate(-1)}>
                Kembali
                </Button>
            </div>

            {purchases.length === 0 ? (
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
                    {purchases.map((purchase) => (
                        <tr key={purchase.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                <span className="text-xs font-medium">Foto</span>
                            </div>
                            <div>
                                <div className="font-medium text-gray-900">{purchase.productName}</div>
                                <span className="text-xs text-gray-500">ID: {purchase.productId}</span>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{purchase.seller}</td>
                        <td className="px-6 py-4 font-medium">Rp. {formatPrice(purchase.price)}</td>
                        <td className="px-6 py-4 text-gray-700">{purchase.date}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                            purchase.status === "Diterima" ? "bg-green-100 text-green-800" :
                            "bg-blue-100 text-blue-800"
                            }`}>
                            {purchase.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <Button
                            variant="danger"
                            size="sm"
                            onClick={() => openReportModal(purchase.productId, purchase.productName)}
                            className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                            >
                            Laporkan
                            </Button>
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
                    Alasan Laporan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="Contoh: Barang tidak sesuai deskripsi, penipuan, dll..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none"
                    rows="3"
                    />
                </div>

                {/* Area Upload Foto Bukti */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto Bukti <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-600 mb-2">Unggah maksimal 3 foto (chat, kondisi barang, dll)</p>
                    
                    <div className="flex flex-wrap gap-2">
                    {evidenceImages.map((img, index) => (
                        <div key={index} className="relative w-16 h-16 border-2 border-dashed border-[#1E3A8A] rounded-lg overflow-hidden">
                        <img src={img} alt={`Bukti ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                            onClick={() => handleRemoveEvidenceImage(index)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                            ×
                        </button>
                        </div>
                    ))}
                    
                    {evidenceImages.length < 3 && (
                        <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="#1E3A8A"
                            className="w-5 h-5"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleEvidenceImageUpload}
                            className="hidden"
                        />
                        </label>
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