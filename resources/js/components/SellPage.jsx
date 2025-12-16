    // src/pages/SellPage.js
    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background"; // ✅ Impor Background

    export default function SellPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        category: "Elektronik",
        price: "",
        location: "",
        condition: "Bekas Baik",
        description: "",
    });

    const [images, setImages] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
        setNotification({ 
            show: true, 
            message: "Maksimal 5 gambar!", 
            type: "error" 
        });
        return;
        }
        const newImages = files.map(file => URL.createObjectURL(file));
        setImages(prev => [...prev, ...newImages]);
    };

    const handleRemoveImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSave = () => {
        if (!formData.name || !formData.price) {
        setNotification({ 
            show: true, 
            message: "Nama dan harga wajib diisi!", 
            type: "error" 
        });
        return;
        }
        if (images.length === 0) {
        setNotification({ 
            show: true, 
            message: "Harap unggah minimal 1 gambar!", 
            type: "error" 
        });
        return;
        }

        const newProduct = {
        ...formData,
        id: Date.now(),
        status: "menunggu",
        images: images,
        uploadedAt: new Date().toLocaleString("id-ID"),
        };

        console.log("Produk dikirim ke admin:", newProduct);
        
        setNotification({ 
        show: true, 
        message: "Produk berhasil dikirim! Menunggu persetujuan admin.", 
        type: "success" 
        });

        setTimeout(() => {
        navigate("/profil");
        }, 2000);
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
        <Background> {/* ✅ Gunakan komponen Background */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
            <button
                onClick={() => navigate("/profil")}
                className="flex items-center gap-2 text-[#1E3A8A] font-medium mb-6 hover:text-[#162e68] transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Kembali ke Profil
            </button>

            <div className="bg-white border border-[#1E3A8A] rounded-xl p-[24px] shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
                <h2 className="text-[17px] font-[600] text-gray-800 mb-[24px]">Unggah Produk Baru</h2>

                {/* Area Unggah Gambar */}
                <div className="mb-6">
                <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                    Foto Produk <span className="text-red-500">*</span>
                </label>
                <p className="text-[13px] text-gray-600 mb-3">
                    Tambahkan hingga 5 foto produk. Foto pertama akan menjadi foto utama.
                </p>
                
                <div className="flex flex-wrap gap-3">
                    {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 border-2 border-dashed border-[#1E3A8A] rounded-lg overflow-hidden">
                        <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                        >
                        ×
                        </button>
                    </div>
                    ))}
                    
                    {images.length < 5 && (
                    <label className="w-24 h-24 border-2 border-dashed border-[#1E3A8A] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50 transition">
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="#1E3A8A"
                        className="w-6 h-6"
                        >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                        </svg>
                        <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                        />
                    </label>
                    )}
                </div>
                </div>

                {/* Form */}
                <div className="space-y-6">
                {/* Nama Produk */}
                <div>
                    <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                    Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Contoh: Iphone 13 Pro Max 128GB"
                    className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                    />
                </div>

                {/* Kategori & Kondisi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                    <div>
                    <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                        Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                    >
                        <option value="Elektronik">Elektronik</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Furnitur">Furnitur</option>
                        <option value="Hobi">Hobi</option>
                        <option value="Rumah Tangga">Rumah Tangga</option>
                    </select>
                    </div>

                    <div>
                    <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                        Kondisi <span className="text-red-500">*</span>
                    </label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                    >
                        <option value="Baru">Baru</option>
                        <option value="Bekas">Bekas</option>
                        <option value="Mulus">Mulus</option>
                        <option value="Bekas Baik">Bekas Baik</option>
                    </select>
                    </div>
                </div>

                {/* Harga & Lokasi */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                    <div>
                    <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                        Harga <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <span className="absolute left-[16px] top-[10px] text-gray-500">Rp.</span>
                        <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0"
                        className="w-full pl-[40px] pr-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                        />
                    </div>
                    </div>

                    <div>
                    <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                        Lokasi <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Contoh: Surabaya Barat"
                        className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                    />
                    </div>
                </div>

                {/* Deskripsi */}
                <div>
                    <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                    Deskripsi Produk <span className="text-red-500">*</span>
                    </label>
                    <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Jelaskan kondisi, spesifikasi, dan detail lainnya..."
                    className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] resize-none transition"
                    ></textarea>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-[16px] pt-4">
                    <button
                    onClick={() => navigate("/profil")}
                    className="px-[24px] py-[10px] border border-[#1E3A8A] text-[#1E3A8A] rounded-[10px] text-[15px] font-[500] hover:bg-[#1E3A8A] hover:text-white transition"
                    >
                    Batal
                    </button>
                    <button
                    onClick={handleSave}
                    className="px-[24px] py-[10px] bg-[#1E3A8A] text-white rounded-[10px] text-[15px] font-[500] hover:bg-[#162e68] transition flex items-center gap-[8px]"
                    >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="white"
                        className="w-5 h-5"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M15 12l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Kirim untuk Review
                    </button>
                </div>
                </div>
            </div>
            </div>

            {/* ✅ POPUP NOTIFIKASI */}
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