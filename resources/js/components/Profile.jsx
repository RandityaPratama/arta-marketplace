    // src/components/ProfilPage.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Background from "../components/Background";
    import Footer from "./Footer";
    import { useProducts } from "../components/context/ProductContext";
    // ✅ Import ikon dari lucide-react
    import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

    // ✅ Fungsi format harga: 12000000 → "12.000.000"
    const formatPrice = (priceStr) => {
    if (!priceStr) return "";
    const clean = priceStr.toString().replace(/\D/g, '');
    if (!clean) return "";
    return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    export default function ProfilPage() {
    const navigate = useNavigate();
    const { getUserProducts } = useProducts();
    const products = getUserProducts();
    const [activeTab, setActiveTab] = useState("aktif");
    
    // ✅ State untuk nama user
    const [userName, setUserName] = useState("Randitya Pratama");
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [newName, setNewName] = useState(userName);

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

    const getProductsByTab = () => {
        if (activeTab === "aktif") {
        return products.filter(p => p.status === "aktif");
        } else if (activeTab === "terjual") {
        return products.filter(p => p.status === "terjual");
        } else if (activeTab === "menunggu") {
        return products.filter(p => p.status === "menunggu" || p.status === "ditolak");
        }
        return [];
    };

    const currentProducts = getProductsByTab();

    // ✅ Handle edit profil
    const handleEditProfile = () => {
        setIsEditModalOpen(true);
        setNewName(userName);
    };

    const handleSaveName = () => {
        if (newName.trim()) {
        setUserName(newName.trim());
        setIsEditModalOpen(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
        setNewName(userName);
    };

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="font-[Poppins] min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
                {/* Profil Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                        <User size={32} className="text-[#1E3A8A]" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{userName}</h2>
                        <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>randityapratama@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>+62 813-888-111</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>Surabaya</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>Bergabung sejak 12 Jan 2025</span>
                        </div>
                        </div>
                    </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" size="md" onClick={handleEditProfile}>
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
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-[0px_4px_11px_rgba(0,0,0,0.07)] relative cursor-pointer"
                        onClick={() => navigate(`/detailseller/${product.id}`)}
                        >
                        {/* ✅ BADGE DISKON DI POJOK KIRI ATAS */}
                        {product.onDiscount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            -{product.discount}%
                            </div>
                        )}

                        <div className="bg-gray-200 h-32 w-full"></div>
                        <div className="p-4">
                            <span className="inline-block bg-[#DDE7FF] text-[#1E3A8A] text-[12px] font-[500] px-2 py-1 rounded-full mb-2">
                            {product.category}
                            </span>
                            <h4 className="text-[14px] font-[500] text-gray-800 truncate">{product.name}</h4>
                            
                            {/* ✅ TAMPILAN HARGA DENGAN DISKON */}
                            <div className="mt-1">
                            {product.onDiscount ? (
                                <>
                                <p className="text-[12px] text-gray-500 line-through">
                                    Rp. {formatPrice(product.originalPrice)}
                                </p>
                                <p className="text-[14px] font-bold text-red-600">
                                    Rp. {formatPrice(product.price)}
                                </p>
                                </>
                            ) : (
                                <p className="text-[14px] font-bold text-black">
                                Rp. {formatPrice(product.price)}
                                </p>
                            )}
                            </div>
                            
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
                                onClick={(e) => {
                                e.stopPropagation();
                                handleReupload(product.id);
                                }}
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
        </Background>
        
        {/* ✅ MODAL EDIT PROFIL */}
        {isEditModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Edit Profil</h3>
                
                <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap
                </label>
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Masukkan nama lengkap"
                />
                </div>

                <div className="flex gap-3">
                <Button
                    variant="outline"
                    size="md"
                    onClick={handleCancelEdit}
                    className="flex-1"
                >
                    Batal
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    onClick={handleSaveName}
                    className="flex-1"
                >
                    Simpan
                </Button>
                </div>
            </div>
            </div>
        )}
        
        <Footer />
        </>
    );
    }