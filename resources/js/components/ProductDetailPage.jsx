// src/pages/ProductDetailPage.js
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "../components/Background";
import { useFavorites } from "../components/context/FavoriteContext"; // ✅ Perbaiki path
import { useChat } from "../components/context/ChatContext";        // ✅ Perbaiki path
import { useReports } from "../components/context/ReportContext";   // ✅ Perbaiki path

// ✅ Data produk
const mockProducts = [
  { 
    id: 1, name: "Samsung S24 Ultra", category: "Elektronik", price: "12.000.000", 
    location: "Jakarta Utara", sellerName: "Budi Santoso", publishedDate: "11/10/2025", condition: "Bekas Baik"
  },
  { 
    id: 2, name: "iPhone 15 Pro", category: "Elektronik", price: "15.500.000", 
    location: "Bandung", sellerName: "Siti Rahayu", publishedDate: "12/10/2025", condition: "Baru"
  },
  { 
    id: 3, name: "Kursi Gaming", category: "Furnitur", price: "2.300.000", 
    location: "Surabaya", sellerName: "Andi Wijaya", publishedDate: "10/10/2025", condition: "Bekas Baik"
  },
  { 
    id: 4, name: "Adidas Adizero Evo SL", category: "Olahraga", price: "1.200.000", 
    location: "Yogyakarta", sellerName: "Dina Putri", publishedDate: "09/10/2025", condition: "Mulus"
  },
];

// ✅ Alasan laporan tetap
const REPORT_REASONS = [
  "Harga tidak sesuai pasar",
  "Menjual barang palsu",
  "Postingan duplikat",
  "Menjual barang terlarang"
];

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { favorites, toggleFavorite } = useFavorites();
  const { startChatAsBuyer } = useChat();
  const { submitReport } = useReports();
  const isFavorited = favorites.has(parseInt(id));

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    const found = mockProducts.find(p => p.id === parseInt(id));
    if (found) {
      setProduct(found);
    } else {
      navigate("/");
    }
  }, [id, navigate]);

  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification({ show: false, message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.show]);

  if (!product) return null;

  const handleContactSeller = () => {
    const message = `Halo, saya tertarik dengan produk "${product.name}". Apakah masih tersedia?`;
    const chatId = startChatAsBuyer(product.id, product, product.sellerName, message);
    navigate(`/chatroom/${chatId}`);
  };

  const openReportModal = () => {
    setIsReportModalOpen(true);
    setSelectedReason("");
  };

  const submitReportForm = () => {
    if (!selectedReason) {
      setNotification({ show: true, message: "Silakan pilih alasan!", type: "error" });
      return;
    }

    const reportData = {
      type: "iklan",
      productId: product.id,
      productName: product.name,
      sellerName: product.sellerName,
      reason: selectedReason,
      status: "Menunggu"
    };

    submitReport(reportData);
    setIsReportModalOpen(false);
    setNotification({ show: true, message: "Laporan berhasil dikirim!", type: "success" });
  };

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1E3A8A] font-medium mb-6 hover:text-[#162e68] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-gray-200 h-[400px] w-full rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Gambar Produk</span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang Penjual</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                    <span className="text-[#1E3A8A] font-bold">P</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{product.sellerName}</h4>
                    <p className="text-xs text-gray-600">{product.location}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* ✅ Header: "Laporkan" di kiri, ❤️ di kanan */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <span className="text-sm font-semibold text-[#1E3A8A] bg-[#F0F7FF] px-3 py-1 rounded-full">
                    {product.category}
                  </span>
                  <h1 className="text-2xl font-bold text-gray-900 mt-3">{product.name}</h1>
                </div>
                {/* ✅ Teks "Laporkan" di kiri, ikon favorit di kanan */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={openReportModal}
                    className="text-red-600 text-sm font-medium hover:underline"
                  >
                    Laporkan
                  </button>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="p-1 text-gray-500 hover:text-[#1E3A8A] transition"
                    aria-label={isFavorited ? "Hapus dari favorit" : "Tambah ke favorit"}
                  >
                    {isFavorited ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#1E3A8A" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <p className="text-2xl font-bold text-[#1E3A8A]">Rp. {product.price}</p>

              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div><p className="font-medium">Lokasi</p><p>{product.location}</p></div>
                <div><p className="font-medium">Kondisi</p><p>{product.condition}</p></div>
                <div><p className="font-medium">Dipublikasikan</p><p>{product.publishedDate}</p></div>
                <div><p className="font-medium">Status</p><span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Tersedia</span></div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button variant="primary" size="md" className="flex-1" onClick={() => alert("Beli Sekarang")}>
                  Beli Sekarang
                </Button>
                <Button variant="outline" size="md" className="flex-1" onClick={handleContactSeller}>
                  Hubungi Penjual
                </Button>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
                <p className="text-gray-600">
                  Produk ini dalam kondisi sangat baik, masih mulus dan berfungsi sempurna.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Laporan */}
        {isReportModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Laporkan Iklan: {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">Pilih alasan pelanggaran:</p>

              <div className="space-y-3 mb-6">
                {REPORT_REASONS.map((reason, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg cursor-pointer ${
                      selectedReason === reason
                        ? "border-[#1E3A8A] bg-[#F0F7FF]"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedReason(reason)}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border mr-3 ${
                        selectedReason === reason ? "bg-[#1E3A8A] border-[#1E3A8A]" : "border-gray-400"
                      } flex items-center justify-center`}>
                        {selectedReason === reason && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-gray-800">{reason}</span>
                    </div>
                  </div>
                ))}
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

        {/* Notifikasi */}
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