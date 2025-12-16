    // src/pages/DetailSellerPage.js
    import React, { useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Background from "./Background";
    import Footer from "./Footer";

    // ✅ Data produk yang sama dengan ProfilPage
    const mockProducts = [
    { 
        id: 1, 
        name: "Samsung S24 Ultra", 
        category: "Elektronik", 
        price: "12000000", 
        location: "Surabaya", 
        publishedDate: "11/10/2025", 
        condition: "Bekas Baik", 
        description: "Produk ini dalam kondisi sangat baik, masih mulus dan berfungsi sempurna. Dijual karena ingin upgrade ke model terbaru. Semua aksesori lengkap dan garansi masih berlaku.", 
        status: "menunggu" 
    },
    { 
        id: 2, 
        name: "iPhone 15 Pro", 
        category: "Elektronik", 
        price: "15500000", 
        location: "Bandung", 
        publishedDate: "12/10/2025", 
        condition: "Baru", 
        description: "iPhone terbaru dengan kamera terbaik dan baterai tahan lama.", 
        status: "aktif" 
    },
    { 
        id: 3, 
        name: "Kursi Gaming", 
        category: "Furnitur", 
        price: "2300000", 
        location: "Surabaya", 
        publishedDate: "10/10/2025", 
        condition: "Bekas Baik", 
        description: "Kursi ergonomis dengan bahan kulit sintetis dan sandaran nyaman.", 
        status: "terjual" 
    },
    { 
        id: 6, 
        name: "HP Android Rusak", 
        category: "Elektronik", 
        price: "300000", 
        location: "Bandung", 
        publishedDate: "05/10/2025", 
        condition: "Rusak", 
        description: "HP masih bisa dinyalakan, layar retak, baterai lemah.", 
        status: "ditolak", 
        rejectionReason: "Foto tidak jelas" 
    },
    { 
        id: 7, 
        name: "Laptop ASUS", 
        category: "Elektronik", 
        price: "5000000", 
        location: "Jakarta", 
        publishedDate: "01/10/2025", 
        condition: "Mulus", 
        description: "Laptop gaming dengan spek tinggi, layar 144Hz, RAM 16GB.", 
        status: "menunggu" 
    },
    ];

    export default function DetailSellerPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const found = mockProducts.find(p => p.id === parseInt(id));
        if (found) {
        setProduct(found);
        setFormData(found);
        } else {
        navigate("/profil");
        }
    }, [id, navigate]);

    if (!product) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePriceChange = (e) => {
        const rawValue = e.target.value.replace(/\D/g, '');
        setFormData((prev) => ({ ...prev, price: rawValue }));
    };

    const handleSave = () => {
        setProduct(formData);
        setIsEditing(false);
        alert("Produk berhasil diperbarui!");
    };

    const handleCancel = () => {
        setFormData(product);
        setIsEditing(false);
    };

    const handleDelete = () => {
        if (window.confirm("Yakin ingin menghapus produk ini?")) {
        alert("Produk dihapus!");
        navigate("/profil");
        }
    };

    const toggleStatus = () => {
        const newStatus = product.status === "aktif" ? "terjual" : "aktif";
        setProduct({ ...product, status: newStatus });
        alert(`Status diubah menjadi: ${newStatus === "terjual" ? "Terjual" : "Aktif"}`);
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

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8">

            <button
                onClick={() => navigate("/profil")}
                className="flex items-center gap-2 text-[#1E3A8A] font-medium mb-6 hover:text-[#162e68] transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Kembali ke Profil
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Kiri: Gambar + Tentang Penjual */}
                <div>
                <div className="bg-gray-100 h-[400px] w-full rounded-lg"></div>

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

                {/* Kanan: Info Produk */}
                <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                    {!isEditing ? (
                        <>
                        <span className="text-sm font-semibold text-[#1E3A8A] bg-[#F0F7FF] px-3 py-1 rounded-full">
                            {product.category}
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 mt-3 leading-tight">
                            {product.name}
                        </h1>
                        </>
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

                {!isEditing ? (
                    <div>
                    <p className="text-2xl font-bold text-[#1E3A8A]">Rp. {formatPrice(product.price)}</p>
                    </div>
                ) : null}

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

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga (Rp) *</label>
                        <input
                        type="text"
                        value={formatPrice(formData.price)}
                        onChange={handlePriceChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Contoh: 12000000"
                        />
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

                    <div className="pt-2">
                        <Button
                        variant="danger"
                        size="md"
                        onClick={handleDelete}
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
        </Background>
        <Footer />
        </>
    );
    }