// src/components/SellPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Button from "../components/ui/Button";
import NavbarAfter from "./NavbarAfter";
import Footer from "./Footer";
import Background from "../components/Background";
import { useProducts } from "../components/context/ProductContext";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// ✅ Helper function untuk format harga dengan titik
const formatPriceWithDots = (value) => {
  if (!value) return "";
  const numericValue = value.replace(/\D/g, "");
  if (!numericValue) return "";
  return new Intl.NumberFormat('id-ID').format(numericValue);
};

// ✅ Helper function untuk parse harga ke number
const parsePrice = (formattedValue) => {
  if (!formattedValue) return "";
  return formattedValue.replace(/\D/g, "");
};

export default function SellPage() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    originalPrice: "",
    discount: "",
    location: "",
    condition: "Bekas Baik",
    description: "",
  });

  const [images, setImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();
        if (result.success) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil kategori:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!formData.category && categories.length > 0) {
      setFormData(prev => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "originalPrice") {
      const formattedValue = formatPriceWithDots(value);
      const numericValue = parsePrice(formattedValue);
      
      setFormData(prev => ({ 
        ...prev, 
        originalPrice: formattedValue,
        price: numericValue ? calculateDiscountedPrice(numericValue, prev.discount) : ""
      }));
    } 
    else if (name === "discount") {
      const numericValue = value.replace(/\D/g, "");
      const validDiscount = numericValue === "" ? "" : Math.min(parseInt(numericValue) || 0, 100).toString();
      
      setFormData(prev => ({ 
        ...prev, 
        discount: validDiscount,
        price: prev.originalPrice ? calculateDiscountedPrice(parsePrice(prev.originalPrice), validDiscount) : prev.price
      }));
    }
    else if (name === "price") {
      const formattedValue = formatPriceWithDots(value);
      setFormData(prev => ({ ...prev, price: formattedValue }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateDiscountedPrice = (originalPriceStr, discountStr) => {
    const originalPrice = parseFloat(originalPriceStr);
    const discount = parseFloat(discountStr) || 0;
    
    if (isNaN(originalPrice) || originalPrice <= 0) return "";
    
    const finalPrice = originalPrice * (1 - discount / 100);
    return Math.round(finalPrice).toString();
  };

  const calculateDiscountAmount = () => {
    const originalPrice = parseFloat(parsePrice(formData.originalPrice));
    const discount = parseFloat(formData.discount) || 0;
    
    if (isNaN(originalPrice) || originalPrice <= 0 || discount <= 0) return 0;
    
    return Math.round(originalPrice * (discount / 100));
  };

  const handleImageUpload = (e) => {
    const input = e.target;
    const files = Array.from(input.files || []);
    if (files.length + images.length > 5) {
      setNotification({ show: true, message: "Maksimal 5 gambar!", type: "error" });
      input.value = "";
      return;
    }
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...newImages]);
    setImageFiles(prev => [...prev, ...files]);
    input.value = "";
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.location || !formData.description) {
      setNotification({ show: true, message: "Nama, kategori, lokasi, dan deskripsi wajib diisi!", type: "error" });
      return;
    }

    if (!formData.price && !formData.originalPrice) {
      setNotification({ show: true, message: "Harga wajib diisi!", type: "error" });
      return;
    }

    if (images.length === 0) {
      setNotification({ show: true, message: "Harap unggah minimal 1 gambar!", type: "error" });
      return;
    }

    setIsSubmitting(true);

    const originalPriceNumeric = parsePrice(formData.originalPrice);
    const priceNumeric = parsePrice(formData.price);
    const discountNumeric = formData.discount;

    const finalPrice = originalPriceNumeric 
      ? calculateDiscountedPrice(originalPriceNumeric, discountNumeric)
      : priceNumeric;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", finalPrice);
    
    if (originalPriceNumeric) {
      data.append("original_price", originalPriceNumeric);
    }
    
    if (discountNumeric) {
      data.append("discount", discountNumeric);
    }
    
    data.append("location", formData.location);
    data.append("condition", formData.condition);
    data.append("description", formData.description);

    imageFiles.forEach((file) => {
      data.append("images[]", file);
    });

    try {
      await addProduct(data);

      setNotification({ 
        show: true, 
        message: "Produk berhasil dikirim! Menunggu persetujuan admin.", 
        type: "success" 
      });

      setTimeout(() => {
        navigate("/profile", { state: { fromSellPage: true } });
      }, 2000);
    } catch (error) {
      setNotification({ show: true, message: "Gagal mengunggah produk: " + error.message, type: "error" });
      setIsSubmitting(false);
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

  const displayPrice = (priceStr) => {
    if (!priceStr) return "";
    const numeric = parsePrice(priceStr);
    return numeric ? new Intl.NumberFormat('id-ID').format(numeric) : "";
  };

  // ✅ Tentukan apakah sedang pakai diskon atau tidak
  const hasDiscount = formData.originalPrice && formData.discount && parseInt(formData.discount) > 0;
  const isOnlyOriginalPrice = formData.originalPrice && !formData.discount;

  return (
    <>
      <NavbarAfter />
      <Background>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#1E3A8A] font-medium mb-6 hover:text-[#162e68] transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
            Kembali
          </button>

          <div className="bg-white border rounded-xl p-[24px] shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
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
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 bg-opacity-90 hover:bg-opacity-100 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md hover:shadow-lg transition-all duration-200 z-10"
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
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <div>
                  <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                    Harga Asli (Rp) <span className="text-gray-500"></span>
                  </label>
                  <input
                    type="text"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    placeholder="Contoh: 1.000.000"
                    className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                    Diskon (%)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    placeholder="Contoh: 10"
                    className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                  />
                  <p className="text-[12px] text-gray-500 mt-1">Isi jika ingin memberi diskon</p>
                  {hasDiscount && (
                    <p className="text-[12px] text-green-600 mt-1">
                      Diskon {formData.discount}% (-Rp {displayPrice(calculateDiscountAmount().toString())})
                    </p>
                  )}
                </div>
              </div>

              {(formData.originalPrice || formData.discount) && (
                <div className="p-3 bg-gray-50 rounded-lg border">
                  {formData.originalPrice && (
                    <p className="text-[13px] text-gray-700">
                      Harga asli: Rp {displayPrice(formData.originalPrice)}
                    </p>
                  )}
                  {hasDiscount && (
                    <p className="text-[13px] text-red-500 mt-1">
                      Diskon {formData.discount}% (-Rp {displayPrice(calculateDiscountAmount().toString())})
                    </p>
                  )}
                  {formData.originalPrice && (
                    <p className="text-[13px] font-bold text-green-600 mt-2">
                      {hasDiscount ? 'Harga setelah diskon' : 'Harga asli'}: Rp {displayPrice(formData.price)}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
                <div>
                  {!formData.originalPrice ? (
                    <>
                      <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                        Harga <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="Contoh: 900.000"
                        className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] focus:border-[#1E3A8A] transition"
                      />
                    </>
                  ) : (
                    <div>
                      <label className="block text-[13px] font-[500] text-gray-700 mb-[8px]">
                        {/* ✅ DINAMIS: "Harga Asli" atau "Harga Setelah Diskon" */}
                        {isOnlyOriginalPrice ? 'Harga Asli' : 'Harga Setelah Diskon'}
                      </label>
                      <input
                        type="text"
                        value={displayPrice(formData.price)}
                        readOnly
                        className="w-full px-[16px] py-[10px] text-[15px] border border-gray-300 rounded-lg bg-gray-100"
                      />
                    </div>
                  )}
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

              <div className="flex justify-end gap-[16px] pt-4">
                <button
                  onClick={() => navigate("/profile")}
                  className="px-[24px] py-[10px] border border-[#1E3A8A] text-[#1E3A8A] rounded-[10px] text-[15px] font-[500] hover:bg-[#1E3A8A] hover:text-white transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className={`px-[24px] py-[10px] bg-[#1E3A8A] text-white rounded-[10px] text-[15px] font-[500] hover:bg-[#162e68] transition flex items-center gap-[8px] ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Memproses...
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

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