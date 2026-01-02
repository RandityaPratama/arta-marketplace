    // src/components/context/ProductContext.js
    import React, { createContext, useContext, useState } from "react";

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

    const ProductContext = createContext();

    // ✅ Data dummy awal - produk campuran (milikmu + orang lain)
    const initialProducts = [
    // 🔸 PRODUK MILIKMU (sellerId: "user-1")
    { 
        id: 1, 
        name: "Samsung S24 Ultra", 
        category: "Elektronik", 
        price: "10800000",
        originalPrice: "12000000",
        discount: "10",
        onDiscount: true,
        location: "Surabaya", 
        sellerName: "Randitya Pratama",
        publishedDate: "11/10/2025", 
        condition: "Bekas Baik", 
        description: "Produk ini dalam kondisi sangat baik, masih mulus dan berfungsi sempurna.", 
        status: "menunggu",
        sellerId: "user-1"
    },
    { 
        id: 2, 
        name: "iPhone 15 Pro", 
        category: "Elektronik", 
        price: "15500000", 
        location: "Bandung", 
        sellerName: "Randitya Pratama",
        publishedDate: "12/10/2025", 
        condition: "Baru", 
        description: "iPhone terbaru dengan kamera terbaik.", 
        status: "aktif",
        sellerId: "user-1"
    },
    { 
        id: 3, 
        name: "Kursi Gaming", 
        category: "Furnitur", 
        price: "2300000", 
        location: "Surabaya", 
        sellerName: "Randitya Pratama",
        publishedDate: "10/10/2025", 
        condition: "Bekas Baik", 
        description: "Kursi ergonomis dengan bahan kulit sintetis.", 
        status: "terjual",
        sellerId: "user-1"
    },
    { 
        id: 4, 
        name: "Adidas Adizero Evo SL", 
        category: "Olahraga", 
        price: "960000",
        originalPrice: "1200000",
        discount: "20",
        onDiscount: true,
        location: "Yogyakarta", 
        sellerName: "Randitya Pratama",
        publishedDate: "09/10/2025", 
        condition: "Mulus", 
        description: "Sepatu lari ringan dengan teknologi responsif.", 
        status: "aktif",
        sellerId: "user-1"
    },

    // 🔸 PRODUK ORANG LAIN (sellerId: "user-2", "user-3", dll)
    { 
        id: 5, 
        name: "MacBook Air M2", 
        category: "Elektronik", 
        price: "18500000", 
        location: "Jakarta", 
        sellerName: "Budi Santoso",
        publishedDate: "15/11/2025", 
        condition: "Baru", 
        description: "MacBook baru segel, garansi resmi 1 tahun.", 
        status: "aktif",
        sellerId: "user-2"
    },
    { 
        id: 6, 
        name: "Sepatu Nike Air Force 1", 
        category: "Fashion", 
        price: "1200000", 
        originalPrice: "1500000",
        discount: "20",
        onDiscount: true,
        location: "Bandung", 
        sellerName: "Siti Rahayu",
        publishedDate: "20/11/2025", 
        condition: "Mulus", 
        description: "Sepatu original, belum pernah dipakai.", 
        status: "aktif",
        sellerId: "user-3"
    },
    { 
        id: 7, 
        name: "Meja Belajar Minimalis", 
        category: "Furnitur", 
        price: "850000", 
        location: "Surabaya", 
        sellerName: "Andi Wijaya",
        publishedDate: "05/12/2025", 
        condition: "Bekas Baik", 
        description: "Meja kayu jati, masih kokoh dan kuat.", 
        status: "aktif",
        sellerId: "user-4"
    },
    { 
        id: 8, 
        name: "Kamera Canon EOS R50", 
        category: "Elektronik", 
        price: "12500000", 
        originalPrice: "14000000",
        discount: "11",
        onDiscount: true,
        location: "Yogyakarta", 
        sellerName: "Dina Putri",
        publishedDate: "10/12/2025", 
        condition: "Baru", 
        description: "Kamera mirrorless terbaru, lengkap dengan lensa kit.", 
        status: "aktif",
        sellerId: "user-5"
    }
    ];

    export function ProductProvider({ children }) {
    const [products, setProducts] = useState(initialProducts);

    // ✅ Tambah produk baru
    const addProduct = async (productData) => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${API_URL}/add-products`, {
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
    const deleteProduct = (productId) => {
        setProducts(prev => prev.filter(product => product.id !== productId));
    };

    // ✅ Ambil produk berdasarkan ID
    const getProductById = (productId) => {
        return products.find(product => product.id === productId);
    };

    // ✅ Ambil produk milik user saat ini
    const getUserProducts = () => {
        return products.filter(product => product.sellerId === "user-1");
    };

    return (
        <ProductContext.Provider 
        value={{ 
            products, 
            addProduct, 
            updateProduct, 
            deleteProduct, 
            getProductById,
            getUserProducts
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