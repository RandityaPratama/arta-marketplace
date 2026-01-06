    // src/components/DetailSellerPage.js
    import React, { useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Background from "./Background";
    import Footer from "./Footer";
    import { useProducts } from "../components/context/ProductContext";
    import { Heart } from "lucide-react"; // ✅ Import ikon dari lucide-react

    export default function DetailSellerPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { products, updateProduct, deleteProduct } = useProducts();
    
    const product = products.find(p => p.id === parseInt(id));
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(product || {});

    // ✅ State untuk modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    if (!product) {
        navigate("/profile");
        return null;
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setFormData((prev) => ({ ...prev, price: rawValue }));
    };

    const handleOriginalPriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setFormData((prev) => ({ ...prev, originalPrice: rawValue }));
    };

    const handleDiscountChange = (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value && parseInt(value) > 100) value = "100";
        setFormData((prev) => ({ ...prev, discount: value }));
    };

    const calculateDiscountedPrice = () => {
        const { originalPrice, discount } = formData;
        if (!originalPrice || !discount) return formData.price;

        const price = parseFloat(originalPrice);
        const disc = parseFloat(discount);
        
        if (isNaN(price) || isNaN(disc) || disc < 0 || disc > 100) return formData.price;
        
        return Math.round(price * (1 - disc / 100)).toString();
    };

    const handleSave = () => {
        let finalPrice = formData.price;
        let onDiscount = false;

        if (formData.originalPrice && formData.discount) {
        final_PRICE = calculateDiscountedPrice();
        onDiscount = true;
        }

        const updatedProduct = {
        ...formData,
        price: finalPrice,
        onDiscount,
        };

        updateProduct(product.id, updatedProduct);
        setIsEditing(false);
        
        // ✅ Notifikasi toast
        setNotification({ 
        show: true, 
        message: "Produk berhasil diperbarui!", 
        type: "success" 
        });
    };

    const handleCancel = () => {
        setFormData(product);
        setIsEditing(false);
    };

    // ✅ Buka modal hapus
    const handleDeleteClick = () => {
        setIsDeleteModalOpen(true);
    };

    // ✅ Konfirmasi hapus
    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProduct(product.id);
            setIsDeleteModalOpen(false);
            // Redirect akan terjadi otomatis karena product menjadi undefined di context
            navigate("/profile");
        } catch (error) {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
            setNotification({ 
                show: true, 
                message: "Gagal menghapus produk: " + (error.message || "Terjadi kesalahan"), 
                type: "error" 
            });
        }
    };

    const toggleStatus = () => {
        const newStatus = product.status === "aktif" ? "terjual" : "aktif";
        updateProduct(product.id, { status: newStatus });
        
        setNotification({ 
        show: true, 
        message: `Status diubah menjadi: ${newStatus === "terjual" ? "Terjual" : "Aktif"}`, 
        type: "success" 
        });
    };

    const formatPrice = (priceStr) => {
        if (!priceStr) return "";
        const clean = priceStr.replace(/\D/g, '');
        if (!clean) return "";
        return clean.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const getStatusLabel = (status) => {
        switch (status) {
        case "menunggu": return "Menunggu Persetujuan";
        case "aktif": return "Aktif";
        case "terjual": return "Terjual";
        case "ditolak": return "Ditolak";
        default: return status;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
        case "menunggu": return "bg-yellow-100 text-yellow-800";
        case "aktif": return "bg-green-100 text-green-800";
        case "terjual": return "bg-blue-100 text-blue-800";
        case "ditolak": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
        }
    };

    // ✅ Auto-hide notification
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
                <div className="bg-gray-100 h-[400px] w-full rounded-lg overflow-hidden flex items-center justify-center">
                    {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-gray-400">No Image</span>
                    )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang Penjual</h3>
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="#1E3A8A" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                        </svg>
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 text-sm">Randitya Pratama</h4>
                        <p className="text-xs text-gray-600">{product.location}</p>
                    </div>
                    </div>
                </div>
                </div>

                <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                    {!isEditing ? (
                        <div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-[#1E3A8A] bg-[#F0F7FF] px-3 py-1 rounded-full">
                            {product.category}
                            </span>
                            {product.onDiscount && (
                            <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded-full">
                                -{product.discount}%
                            </span>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mt-3 leading-tight">
                            {product.name}
                        </h1>
                        </div>
                    ) : (
                        <h1 className="text-2xl font-bold text-gray-900">Edit Produk</h1>
                    )}
                    </div>

                    {!isEditing ? (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                        Edit
                        </Button>
                        {product.status === "aktif" && (
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={toggleStatus}
                        >
                            Tandai Terjual
                        </Button>
                        )}
                    </div>
                    ) : (
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleCancel}>
                        Batal
                        </Button>
                        <Button variant="primary" size="sm" onClick={handleSave}>
                        Simpan
                        </Button>
                    </div>
                    )}
                </div>

                {!isEditing && (
                    <div>
                    {product.onDiscount ? (
                        <>
                        <p className="text-xl text-gray-500 line-through">
                            Rp. {formatPrice(product.originalPrice)}
                        </p>
                        <p className="text-2xl font-bold text-[#1E3A8A] mt-1">
                            Rp. {formatPrice(product.price)}
                        </p>
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-[#1E3A8A]">
                        Rp. {formatPrice(product.price)}
                        </p>
                    )}
                    </div>
                )}

                {isEditing ? (
                    <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Produk *</label>
                        <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                        <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
                        >
                        <option value="Elektronik">Elektronik</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Furnitur">Furnitur</option>
                        <option value="Hobi">Hobi</option>
                        <option value="Rumah Tangga">Rumah Tangga</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Harga Asli (Rp)
                        </label>
                        <input
                            type="text"
                            value={formatPrice(formData.originalPrice || "")}
                            onChange={handleOriginalPriceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
                            placeholder="Contoh: 12000000"
                        />
                        </div>
                        <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Diskon (%)
                        </label>
                        <input
                            type="text"
                            value={formData.discount || ""}
                            onChange={handleDiscountChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
                            placeholder="Contoh: 10"
                        />
                        </div>
                    </div>

                    {formData.originalPrice && formData.discount && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                            Harga setelah diskon:{" "}
                            <span className="font-bold text-green-600">
                            Rp. {formatPrice(calculateDiscountedPrice())}
                            </span>
                        </p>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
                        <input
                        type="text"
                        value={formatPrice(formData.price)}
                        onChange={handlePriceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Contoh: 12000000"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                        Jika tidak pakai diskon, isi harga langsung di sini.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi *</label>
                        <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition focus:ring-[#1E3A8A]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kondisi *</label>
                        <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition focus:ring-[#1E3A8A]"
                        >
                        <option value="Baru">Baru</option>
                        <option value="Bekas">Bekas</option>
                        <option value="Mulus">Mulus</option>
                        <option value="Bekas Baik">Bekas Baik</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi *</label>
                        <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition focus:ring-[#1E3A8A]"
                        />
                    </div>
                    </div>
                ) : (
                    <>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                        <p className="font-medium text-gray-900">Lokasi</p>
                        <p>{product.location}</p>
                        </div>
                        <div>
                        <p className="font-medium text-gray-900">Kondisi</p>
                        <p>{product.condition}</p>
                        </div>
                        <div>
                        <p className="font-medium text-gray-900">Dipublikasikan</p>
                        <p>{product.publishedDate}</p>
                        </div>
                        <div>
                        <p className="font-medium text-gray-900">Status</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(product.status)}`}>
                            {getStatusLabel(product.status)}
                        </span>
                        </div>
                    </div>

                    {product.status === "ditolak" && (
                        <div className="pt-2">
                        <p className="text-sm text-red-600">
                            <span className="font-medium">Alasan penolakan:</span> {product.rejectionReason}
                        </p>
                        </div>
                    )}

                    {/* ✅ ACTION BUTTONS - FAVORIT + HAPUS BERDAMPINGAN */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        {/* ✅ JUMLAH FAVORIT - DENGAN IKON BIRU */}
                        <div className="flex items-center gap-2">
                        <Heart size={17} className="text-[#1E3A8A]" /> {/* ✅ IKON BIRU */}
                        <span className="text-sm text-gray-600">
                            Disukai oleh <span className="font-medium">{product.favoriteCount || 0}</span> orang
                        </span>
                        </div>
                        
                        {/* ✅ TOMBOL HAPUS */}
                        <Button
                        variant="danger"
                        size="md"
                        onClick={handleDeleteClick}
                        className="border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                        >
                        Hapus Produk
                        </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words max-h-40 overflow-y-auto">
                        {product.description}
                        </p>
                    </div>
                    </>
                )}
                </div>
            </div>
            </div>

            {/* ✅ MODAL HAPUS PRODUK */}
            {isDeleteModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl p-6 w-full max-w-md">
                <div className="text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="red" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 5.63a1.5 1.5 0 002.122 2.122L9 17.424m7.178-8.25L18.878 12M3 12h18M5.5 19.5h13a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H5.5A1.5 1.5 0 004 6v12a1.5 1.5 0 001.5 1.5z" />
                    </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Konfirmasi Hapus</h3>
                    <p className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin menghapus produk <span className="font-medium">"{product.name}"</span>? 
                    Tindakan ini tidak dapat dikembalikan.
                    </p>
                    <div className="flex gap-3">
                    <Button
                        variant="outline"
                        size="md"
                        onClick={() => setIsDeleteModalOpen(false)}
                        className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="danger"
                        size="md"
                        onClick={handleConfirmDelete}
                        disabled={isDeleting}
                        className="flex-1 bg-red-600 text-white hover:bg-red-700 border-red-600"
                    >
                        {isDeleting ? "Menghapus..." : "Hapus"}
                    </Button>
                    </div>
                </div>
                </div>
            </div>
            )}

            {/* ✅ NOTIFIKASI TOAST */}
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