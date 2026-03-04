    // src/components/CheckoutPage.js
    import React, { useState, useEffect } from "react";
    import { useNavigate, useParams } from "react-router-dom";
    import NavbarAfter from "./NavbarAfter";
    import Footer from "./Footer";
    import Background from "../components/Background";
    import Button from "../components/ui/Button";

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

    // ✅ Format harga HANYA untuk tampilan (TIDAK dipakai untuk kalkulasi)
    const formatPrice = (price) => {
    if (price === undefined || price === null) return "";
    // Pastikan input adalah number dulu sebelum di-format
    const num = Number(price);
    return isNaN(num) ? "" : num.toLocaleString('id-ID');
    };

    // ✅ Opsi kurir
    const SHIPPING_OPTIONS = [
    { id: 'jne', name: 'JNE Reguler', cost: 15000 },
    { id: 'pos', name: 'POS Kilat', cost: 12000 },
    { id: 'sicepat', name: 'SiCepat REG', cost: 18000 },
    { id: 'gojek', name: 'GoSend Same Day', cost: 25000 }
    ];

    export default function CheckoutPage() {
    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shippingAddress, setShippingAddress] = useState('');
    const [selectedCourier, setSelectedCourier] = useState(SHIPPING_OPTIONS[0]);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });

    // ✅ Load Snap.js dari Midtrans
    useEffect(() => {
        const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
        const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

        if (!clientKey) {
        console.error("❌ VITE_MIDTRANS_CLIENT_KEY tidak ditemukan di file .env");
        return;
        }

        if (document.querySelector(`script[src="${snapScript}"]`)) return;

        const script = document.createElement('script');
        script.src = snapScript;
        script.setAttribute('data-client-key', clientKey);
        script.async = true;
        document.body.appendChild(script);

        return () => {
        const existing = document.querySelector(`script[src="${snapScript}"]`);
        if (existing) document.body.removeChild(existing);
        };
    }, []);

    // ✅ Ambil data produk
    useEffect(() => {
        const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
            navigate('/login');
            return;
            }
            const response = await fetch(`${API_URL}/products/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.success) setProduct(result.data);
            else navigate('/marketplace');
        } catch (error) {
            console.error(error);
            navigate('/marketplace');
        } finally {
            setLoading(false);
        }
        };
        if (id) fetchProduct();
    }, [id, navigate]);

    // ✅ HITUNG TOTAL SEBAGAI NUMBER (PENTING!)
    // Kita pastikan semua variabel ini adalah angka murni (integer/float), BUKAN string dengan titik
    const productPrice = product ? parseFloat(product.price) || 0 : 0;
    const shippingCost = parseFloat(selectedCourier.cost) || 0;
    const totalAmount = productPrice + shippingCost;

    const handlePayment = async () => {
        if (!shippingAddress.trim()) {
        setNotification({ show: true, message: "Alamat pengiriman wajib diisi!", type: "error" });
        return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
        setNotification({ show: true, message: "Silakan login terlebih dahulu", type: "error" });
        return;
        }

        try {
        // ✅ PENTING: Kirim DATA MURNI (NUMBER), BUKAN STRING DENGAN TITIK
        const payload = {
            product_id: product.id,
            shipping_address: shippingAddress,
            courier: selectedCourier.id,
            courier_name: selectedCourier.name,
            
            // ✅ Pastikan ini ANGKA MURNI (contoh: 15000), bukan "15.000"
            shipping_cost: shippingCost,   
            total_amount: totalAmount       
        };

        console.log("🚀 Mengirim Payload ke Backend:", payload); // Debugging: Cek apakah angkanya benar

        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Gagal memproses checkout");
        }

        const snapToken = result.data.snap_token;

        if (!snapToken) {
            throw new Error("Token pembayaran tidak valid dari server");
        }

        if (!window.snap) {
            throw new Error("Sistem pembayaran belum siap. Coba refresh halaman.");
        }

        window.snap.pay(snapToken, {
            onSuccess: () => {
            setNotification({ show: true, message: "Pembayaran Berhasil!", type: "success" });
            setTimeout(() => navigate('/history'), 1500);
            },
            onPending: () => {
            setNotification({ show: true, message: "Menunggu Pembayaran...", type: "info" });
            setTimeout(() => navigate('/history'), 1500);
            },
            onError: () => {
            setNotification({ show: true, message: "Pembayaran Gagal", type: "error" });
            }
        });

        } catch (error) {
        console.error("Error Pembayaran:", error);
        setNotification({ show: true, message: error.message, type: "error" });
        }
    };

    if (loading) return <Background><div className="max-w-[1200px] mx-auto py-12 text-center">Memuat detail checkout...</div></Background>;
    if (!product) return null;

    return (
        <>
        <NavbarAfter />
        <Background>
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-8">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[#1E3A8A] font-medium mb-6 hover:text-[#162e68]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                Kembali
            </button>

            <div className="bg-white p-6 rounded-xl border">
                <h2 className="text-lg font-semibold mb-6">Detail Pembelian</h2>
                
                {/* Detail Produk */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-[#1E3A8A] bg-[#F0F7FF] px-2 py-1 rounded">{product.category}</span>
                    {product.onDiscount && <span className="text-xs font-bold bg-red-500 text-white px-2 py-1 rounded">-{product.discount}%</span>}
                </div>
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <p className="text-red-600 font-bold mt-2">Rp {formatPrice(productPrice)}</p>
                </div>

                {/* Alamat */}
                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Pengiriman</label>
                <textarea value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} placeholder="Contoh: Jl. Mawar No. 10, Surabaya..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]" rows="3"></textarea>
                </div>

                {/* Kurir */}
                <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Kurir</label>
                <div className="space-y-2">
                    {SHIPPING_OPTIONS.map((courier) => (
                    <div key={courier.id} onClick={() => setSelectedCourier(courier)} className={`p-3 border rounded-lg cursor-pointer transition ${selectedCourier.id === courier.id ? 'border-[#1E3A8A] bg-[#F0F7FF]' : 'border-gray-300 hover:bg-gray-50'}`}>
                        <div className="flex justify-between items-center">
                        <span className="text-gray-800">{courier.name}</span>
                        <span className="font-medium text-gray-900">Rp {formatPrice(courier.cost)}</span>
                        </div>
                    </div>
                    ))}
                </div>
                </div>

                {/* Ringkasan */}
                <div className="border-t pt-4">
                <div className="flex justify-between text-gray-700 mb-1"><span>Harga Barang</span><span>Rp {formatPrice(productPrice)}</span></div>
                <div className="flex justify-between text-gray-700 mb-1"><span>Ongkir</span><span>Rp {formatPrice(shippingCost)}</span></div>
                <div className="flex justify-between font-bold text-lg mt-3 pt-3 border-t border-gray-200">
                    <span>Total Bayar</span>
                    <span className="text-red-600">Rp {formatPrice(totalAmount)}</span>
                </div>
                </div>

                <Button variant="primary" size="md" className="w-full mt-6" onClick={handlePayment}>Bayar Sekarang</Button>
            </div>
            </div>

            {notification.show && (
            <div className="fixed top-4 right-4 z-50 max-w-xs p-4 rounded-lg shadow-lg text-white animate-fade-in" style={{ backgroundColor: notification.type === "success" ? "#10B981" : "#EF4444" }} onClick={() => setNotification({ show: false })}>
                <p className="text-sm">{notification.message}</p>
            </div>
            )}
        </Background>
        <Footer />
        </>
    );
    }