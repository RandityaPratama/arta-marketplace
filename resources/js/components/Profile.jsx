    // src/components/ProfilePage.js
    import React, { useState, useEffect } from "react";
    import { useNavigate, useLocation } from "react-router-dom"; // ✅ Tambahkan useLocation
    import Button from "../components/ui/Button";
    import NavbarAfter from "./NavbarAfter";
    import Background from "../components/Background";
    import Footer from "./Footer";
    import { useProducts } from "../components/context/ProductContext";
import { useProfile } from "../components/context/ProfileContext";
import { useAuth } from "../components/context/AuthContext";
    import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

    const formatPrice = (price) => {
      if (price === undefined || price === null) return "";
      return Number(price).toLocaleString('id-ID');
    };

    export default function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation(); // ✅
    const { getUserProducts, fetchMyProducts } = useProducts();
    const { user, updateProfile, updateAvatar, getJoinDate, loading: profileLoading } = useProfile();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const products = getUserProducts();
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    
    // 🔍 DEBUG: Cek data user di Console Browser (F12)
    console.log("Profile Page User Data:", user);

    // ✅ Redirect ke login jika tidak terautentikasi
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [authLoading, isAuthenticated, navigate]);

    // ✅ Tampilkan Loading Spinner jika sedang memuat data user
    if (authLoading) {
        return (
            <>
                <NavbarAfter />
                <Background>
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
                    </div>
                </Background>
                <Footer />
            </>
        );
    }

    // ✅ Ambil data terbaru saat halaman profil dibuka
    useEffect(() => {
        fetchMyProducts();
    }, [fetchMyProducts]);

    // ✅ Set tab berdasarkan asal halaman
    const initialTab = location.state?.fromSellPage ? "menunggu" : "aktif";
    const [activeTab, setActiveTab] = useState(initialTab);
    
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        phone: '',
        location: ''
    });
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });


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

    // Buka modal edit dan isi dengan data user saat ini
    const handleEditProfile = () => {
        if (user) {
            setEditFormData({
                name: user.name || '',
                phone: user.phone || '',
                location: user.location || ''
            });
        }
        setIsEditModalOpen(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (!editFormData.name.trim()) {
            setNotification({ show: true, message: "Nama tidak boleh kosong", type: "error" });
            return;
        }

        const result = await updateProfile(editFormData);
        
        setNotification({ show: true, message: result.message, type: result.success ? "success" : "error" });

        if (result.success) {
            setIsEditModalOpen(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditModalOpen(false);
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validasi ukuran file (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                setNotification({ show: true, message: "Ukuran file maksimal 2MB", type: "error" });
                return;
            }

            // Validasi tipe file
            if (!file.type.startsWith('image/')) {
                setNotification({ show: true, message: "File harus berupa gambar", type: "error" });
                return;
            }

            // Upload avatar
            const result = await updateAvatar(file);
            setNotification({ show: true, message: result.message, type: result.success ? "success" : "error" });
        }
    };

    // ✅ Reset state setelah beberapa detik (opsional)
    useEffect(() => {
        if (location.state?.fromSellPage) {
        // Opsional: reset state setelah 5 detik agar tab normal lagi
        const timer = setTimeout(() => {
            navigate("/profile", { replace: true });
        }, 5000);
        return () => clearTimeout(timer);
        }
    }, [location.state, navigate]);

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
            <div className="font-[Poppins] min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8">
                {/* Profil Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-[0px_4px_11px_rgba(0,0,0,0.07)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-[#DDE7FF] rounded-full flex items-center justify-center overflow-hidden group">
                        {user?.avatar ? (
                            <img 
                                src={`http://127.0.0.1:8000/storage/${user.avatar}`} 
                                alt={user.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={32} className="text-[#1E3A8A]" strokeWidth={1.5} />
                        )}
                        <label 
                            htmlFor="avatar-upload" 
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        >
                            <span className="text-white text-xs">Ubah</span>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">{user?.name || 'Pengguna'}</h2>
                        <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Mail size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>{user?.email || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>{user?.phone || 'No. HP belum diatur'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>{user?.location || 'Lokasi belum diatur'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500" strokeWidth={1.5} />
                            <span>Bergabung sejak {getJoinDate()}</span>
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
                <div id="products-section"> {/* ✅ ID untuk scroll (opsional) */}
                {currentProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {currentProducts.map((product) => (
                        <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-[0px_4px_11px_rgba(0,0,0,0.07)] relative cursor-pointer"
                        onClick={() => navigate(`/detailseller/${product.id}`)}
                        >
                        {product.onDiscount && (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                            -{product.discount}%
                            </div>
                        )}

                        <div className="bg-gray-200 h-32 w-full overflow-hidden">
                            {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}
                        </div>
                        <div className="p-4">
                            <span className="inline-block bg-[#DDE7FF] text-[#1E3A8A] text-[12px] font-[500] px-2 py-1 rounded-full mb-2">
                            {product.category}
                            </span>
                            <h4 className="text-[14px] font-[500] text-gray-800 truncate">{product.name}</h4>
                            
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
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                    placeholder="Masukkan nama lengkap"
                />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">No. Telepon</label>
                    <input
                        type="tel"
                        name="phone"
                        value={editFormData.phone}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Contoh: 08123456789"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lokasi</label>
                    <input
                        type="text"
                        name="location"
                        value={editFormData.location}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                        placeholder="Contoh: Surabaya"
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
                    onClick={handleSaveProfile}
                    disabled={profileLoading}
                    className="flex-1 flex items-center justify-center"
                >
                    {profileLoading ? 'Menyimpan...' : 'Simpan'}
                </Button>
                </div>
            </div>
            </div>
        )}

        {notification.show && (
            <div 
                className="fixed top-4 right-4 z-50 max-w-xs p-4 rounded-lg shadow-lg text-white animate-fade-in"
                style={{ backgroundColor: notification.type === "success" ? "#10B981" : "#EF4444" }}
                onClick={() => setNotification({ show: false, message: "", type: "" })}
            >
                <p className="text-sm">{notification.message}</p>
            </div>
        )}
        
        <Footer />
        </>
    );
    }