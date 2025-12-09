    // src/pages/ProfilPage.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";

    export default function ProfilPage() {
    const navigate = useNavigate();

    const userProducts = [
        { id: 1, name: "Samsung S24 Ultra", category: "Elektronik", price: "12.000.000", location: "Surabaya", status: "menunggu" },
        { id: 2, name: "iPhone 15 Pro", category: "Elektronik", price: "15.500.000", location: "Bandung", status: "aktif" },
        { id: 3, name: "Kursi Gaming", category: "Furnitur", price: "2.300.000", location: "Surabaya", status: "terjual" },
        { id: 6, name: "HP Android Rusak", category: "Elektronik", price: "300.000", location: "Bandung", status: "ditolak", rejectionReason: "Foto tidak jelas" },
        { id: 7, name: "Laptop ASUS", category: "Elektronik", price: "5.000.000", location: "Jakarta", status: "menunggu" },
    ];

    const [products] = useState(userProducts);
    const [activeTab, setActiveTab] = useState("aktif"); // 'aktif', 'terjual', 'menunggu'

    const getStatusBadge = (status) => {
        switch (status) {
        case "menunggu":
            return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">Menunggu</span>;
        case "aktif":
            return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Aktif</span>;
        case "terjual":
            return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">Terjual</span>;
        case "ditolak":
            return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">Ditolak</span>;
        default:
            return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">Tidak Diketahui</span>;
        }
    };

    const handleReupload = (id) => {
        alert(`Unggah ulang produk ID ${id}`);
        navigate(`/sell?productId=${id}`);
    };

    // Tentukan produk untuk tab yang dipilih
    const getProductsByTab = () => {
        if (activeTab === "aktif") {
        return products.filter(p => p.status === "aktif");
        } else if (activeTab === "terjual") {
        return products.filter(p => p.status === "terjual");
        } else if (activeTab === "menunggu") {
        // Tampilkan "menunggu" + "ditolak" di tab "Menunggu"
        return products.filter(p => p.status === "menunggu" || p.status === "ditolak");
        }
        return [];
    };

    const currentProducts = getProductsByTab();

    return (
        <>
        <NavbarAfter />
        <div className="font-[Poppins] bg-white min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            {/* Profil Header */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1E3A8A" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                    </svg>
                    </div>
                    <div>
                    <h2 className="text-lg font-semibold text-gray-800">Randitya Pratama</h2>
                    <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25-2.25c0-4.166-7.384-7.5-16.5-7.5a7.5 7.5 0 01-3.75 1.5" />
                        </svg>
                        <span>randityapratama@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.954a1.5 1.5 0 012.122 2.122L12 14.172V21.75" />
                        </svg>
                        <span>+62 813-888-111</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-5.522 12.858-12 12.858a12.718 12.718 0 01-7.647-3.097 12.718 12.718 0 01-3.097-7.647A12.718 12.718 0 0121 3c7.142 0 12.858 5.522 12.858 12.858z" />
                        </svg>
                        <span>Surabaya</span>
                        </div>
                        <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Bergabung sejak 1/1/2025</span>
                        </div>
                    </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="md" onClick={() => alert("Edit Profil")}>
                    Edit Profil
                    </Button>
                    <Button variant="primary" size="md" onClick={() => navigate("/sell")}>
                    Jual Barang
                    </Button>
                </div>
                </div>
            </div>

            {/* Statistik */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#1E3A8A]">{products.filter(p => p.status === "aktif").length}</p>
                    <p className="text-sm text-gray-600 mt-1">Produk Aktif</p>
                </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
                <div className="text-center">
                    <p className="text-2xl font-bold text-[#1E3A8A]">{products.filter(p => p.status === "terjual").length}</p>
                    <p className="text-sm text-gray-600 mt-1">Produk Terjual</p>
                </div>
                </div>
            </div>

            {/* Tab Header */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                onClick={() => setActiveTab("aktif")}
                className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "aktif"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                Produk Aktif
                </button>
                <button
                onClick={() => setActiveTab("terjual")}
                className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "terjual"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                Terjual
                </button>
                <button
                onClick={() => setActiveTab("menunggu")}
                className={`px-4 py-2 font-medium text-sm ${
                    activeTab === "menunggu"
                    ? "text-[#1E3A8A] border-b-2 border-[#1E3A8A]"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                >
                Menunggu Persetujuan
                </button>
            </div>

            {/* Daftar Produk Berdasarkan Tab */}
            <div>
                {currentProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                    <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-[0px_4px_11px_rgba(0,0,0,0.07)]"
                    >
                        <div className="bg-gray-200 h-32 w-full"></div>
                        <div className="p-4">
                        <span className="inline-block bg-[#DDE7FF] text-[#1E3A8A] text-[12px] font-[500] px-2 py-1 rounded-full mb-2">
                            {product.category}
                        </span>
                        <h4 className="text-[14px] font-[500] text-gray-800 truncate">{product.name}</h4>
                        <p className="text-[14px] font-bold text-black mt-1">Rp. {product.price}</p>
                        <div className="mt-2">
                            {getStatusBadge(product.status)}
                            {product.status === "ditolak" && (
                            <p className="text-[11px] text-gray-600 mt-1">Alasan: {product.rejectionReason}</p>
                            )}
                        </div>
                        {product.status === "ditolak" && (
                            <Button
                            variant="primary"
                            size="sm"
                            className="mt-2 w-full"
                            onClick={() => handleReupload(product.id)}
                            >
                            Unggah Ulang
                            </Button>
                        )}
                        </div>
                    </div>
                    ))}
                </div>
                ) : (
                <div className="text-center py-12 text-gray-500">
                    Tidak ada produk dalam kategori ini.
                </div>
                )}
            </div>
            </div>
        </div>
        <Footer />
        </>
    );
    }