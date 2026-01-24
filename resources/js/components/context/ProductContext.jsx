// src/components/context/ProductContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
// ✅ Dinamis: Menggunakan jalur custom '/product-images' untuk menghindari error 403/404 pada folder storage
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '') + '/product-images';

const ProductContext = createContext();

export function ProductProvider({ children }) {
const [products, setProducts] = useState([]);
const [myProducts, setMyProducts] = useState([]); // ✅ State khusus produk saya
const [pagination, setPagination] = useState(null); // ✅ State untuk pagination
const [loading, setLoading] = useState(true);

// ✅ Fetch produk dari API (menggantikan data dummy)
const fetchProducts = useCallback(async (search = '', category = '') => {
    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category && category !== 'Semua') params.append('category', category);

        const headers = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Asumsi endpoint adalah /products (sesuaikan dengan route di api.php)
        const response = await fetch(`${API_URL}/products?${params.toString()}`, {
            method: 'GET',
            headers
        });
        const result = await response.json();
        
        if (result.success) {
            // Mapping data dari API (snake_case) ke format Frontend (camelCase)
            const mappedData = result.data.map(item => {
                // ✅ Parsing aman untuk images (jaga-jaga jika masih string)
                let itemImages = item.images;
                if (typeof itemImages === 'string') {
                    try { itemImages = JSON.parse(itemImages); } catch (e) { itemImages = []; }
                }
                if (!Array.isArray(itemImages)) itemImages = [];

                return {
                    ...item,
                    originalPrice: item.original_price,
                    sellerName: item.seller_name,
                    sellerId: item.seller_id,
                    publishedDate: item.published_at,
                    onDiscount: !!item.discount,
                    is_mine: !!item.is_mine,
                    favoritesCount: item.favorites_count || 0, // ✅ Tambahkan favorites count
                    images: itemImages.map(path => `${STORAGE_URL}/${path}`) // ✅ Convert path relatif ke URL lengkap
                };
            });
            setProducts(mappedData);
            setPagination(result.pagination); // ✅ Simpan data pagination dari controller
        }
    } catch (err) {
        console.error("Gagal mengambil produk:", err);
    } finally {
        setLoading(false);
    }
}, []);

// ✅ Fetch khusus produk saya (untuk halaman Profil)
const fetchMyProducts = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch(`${API_URL}/products?mine=true`, {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        
        if (result.success) {
            const mappedData = result.data.map(item => {
                // ✅ Parsing aman untuk images
                let itemImages = item.images;
                if (typeof itemImages === 'string') {
                    try { itemImages = JSON.parse(itemImages); } catch (e) { itemImages = []; }
                }
                if (!Array.isArray(itemImages)) itemImages = [];

                return {
                    ...item,
                    originalPrice: item.original_price,
                    sellerName: item.seller_name,
                    sellerId: item.seller_id,
                    publishedDate: item.published_at,
                    onDiscount: !!item.discount,
                    is_mine: true,
                    favoritesCount: item.favorites_count || 0, // ✅ Tambahkan favorites count
                    images: itemImages.map(path => `${STORAGE_URL}/${path}`) // ✅ Convert path relatif ke URL lengkap
                };
            });
            setMyProducts(mappedData);
        }
    } catch (err) {
        console.error("Gagal mengambil produk saya:", err);
    }
}, []);

// ✅ Fetch single product by ID dengan data terbaru
const fetchProductById = useCallback(async (productId) => {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'GET',
            headers
        });
        const result = await response.json();
        
        if (result.success) {
            const item = result.data;
            
            // ✅ Parsing aman untuk images
            let itemImages = item.images;
            if (typeof itemImages === 'string') {
                try { itemImages = JSON.parse(itemImages); } catch (e) { itemImages = []; }
            }
            if (!Array.isArray(itemImages)) itemImages = [];

            const formattedProduct = {
                ...item,
                originalPrice: item.original_price,
                sellerName: item.seller_name,
                sellerId: item.seller_id,
                publishedDate: item.published_at,
                onDiscount: !!item.discount,
                is_mine: !!item.is_mine,
                favoritesCount: item.favorites_count || 0,
                images: itemImages.map(path => `${STORAGE_URL}/${path}`)
            };

            // ✅ Update product in state if it exists
            setProducts(prev => {
                const index = prev.findIndex(p => p.id === productId);
                if (index !== -1) {
                    const updated = [...prev];
                    updated[index] = formattedProduct;
                    return updated;
                }
                return prev;
            });

            return formattedProduct;
        }
        return null;
    } catch (err) {
        console.error("Gagal mengambil detail produk:", err);
        return null;
    }
}, []);

// ✅ Fetch Produk Populer (Berdasarkan jumlah favorit)
const fetchPopularProducts = useCallback(async () => {
    try {
        const token = localStorage.getItem('token');
        const headers = { 'Accept': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_URL}/popular-products`, {
            method: 'GET',
            headers
        });
        const result = await response.json();
        
        if (result.success) {
            return result.data.map(item => {
                // Parsing aman untuk images
                let itemImages = item.images;
                if (typeof itemImages === 'string') {
                    try { itemImages = JSON.parse(itemImages); } catch (e) { itemImages = []; }
                }
                if (!Array.isArray(itemImages)) itemImages = [];

                return {
                    ...item,
                    originalPrice: item.original_price,
                    sellerName: item.seller_name,
                    sellerId: item.seller_id,
                    publishedDate: item.published_at,
                    onDiscount: !!item.discount,
                    is_mine: !!item.is_mine, // ✅ Gunakan nilai is_mine dari API
                    favoritesCount: item.favoriteCount || item.favorites_count || 0, // ✅ Tambahkan favorites count (support both formats)
                    images: itemImages.map(path => `${STORAGE_URL}/${path}`)
                };
            });
        }
        return [];
    } catch (err) {
        console.error("Gagal mengambil produk populer:", err);
        return [];
    }
}, []);

// Load produk saat pertama kali render
useEffect(() => {
    fetchProducts();
}, [fetchProducts]);

// ✅ Tambah produk baru
const addProduct = async (productData) => {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                // Content-Type tidak perlu diset manual saat mengirim FormData
            },
            body: productData // Mengirim FormData ke backend
        });          

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Gagal menambahkan produk');
        }

        // Opsional: Fetch ulang semua produk atau tambahkan manual ke state
        // Untuk sementara kita return result agar komponen pemanggil tahu sukses
        fetchProducts(); // Refresh list agar produk baru muncul
        fetchMyProducts(); // ✅ Refresh list produk saya juga
        return result;

    } catch (error) {
        console.error("Error adding product:", error);
        throw error;
    }
};

// ✅ Update produk yang ada
const updateProduct = (productId, updatedData) => {
    setProducts(prev => 
    prev.map(product => 
        product.id === productId 
        ? { ...product, ...updatedData }
        : product
    )
    );
};

// ✅ Hapus produk
const deleteProduct = async (productId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Gagal menghapus produk');
        }

        // Update state lokal
        setProducts(prev => prev.filter(product => product.id !== productId));
        setMyProducts(prev => prev.filter(product => product.id !== productId));
        
        return result;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw error;
    }
};

// ✅ Ambil produk berdasarkan ID
const getProductById = (productId) => {
    return products.find(product => product.id === productId);
};

// ✅ Ambil produk milik user saat ini
const getUserProducts = () => {
    return myProducts; // ✅ Return dari state khusus, bukan filter dari feed utama
};

// ✅ Ambil produk untuk feed marketplace (Hanya yang statusnya aktif)
const getMarketplaceProducts = () => {
    return products.filter(product => product.status === 'aktif');
};

return (
    <ProductContext.Provider 
    value={{ 
        products, 
        pagination,
        loading,
        fetchProducts,
        fetchProductById,
        fetchPopularProducts,
        fetchMyProducts,
        addProduct, 
        updateProduct, 
        deleteProduct, 
        getProductById,
        getUserProducts,
        getMarketplaceProducts
    }}
    >
    {children}
    </ProductContext.Provider>
);
}

export function useProducts() {
const context = useContext(ProductContext);
if (!context) {
    throw new Error("useProducts must be used within a ProductProvider");
}
return context;
}
