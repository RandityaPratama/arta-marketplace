    // components/LandingPage.jsx
    import React from "react";
    import { useNavigate } from "react-router-dom";
    import {
    ShieldCheck,
    Smartphone,
    Headphones,
    Tv,
    Home,
    Shirt,
    Gem
    } from 'lucide-react';
    import NavbarBefore from "./NavbarBefore";
    import Footer from "./Footer";

    export default function LandingPage() {
    const navigate = useNavigate();

    // ✅ GANTI WARNA DI SINI - Gradien 3 Warna
    const gradientColors = {
        color1: "#e2e9fd", // Biru muda (warna utama ARTA)
        color2: "#fef9f3", // Kuning muda (kesan hangat)
        color3: "#d2ddfb"  // Biru sangat muda (transisi lembut)
    };

    // ✅ Buat string gradien
    const gradientStyle = {
        background: `linear-gradient(to bottom right, ${gradientColors.color1}, ${gradientColors.color2}, ${gradientColors.color3})`
    };

    return (
        <>
        <NavbarBefore/>
        {/* ✅ GRADIEN 3 WARNA DENGAN INLINE STYLE */}
        <div className="font-[Poppins] w-full overflow-x-hidden" style={gradientStyle}>
            
            {/* HERO - LEBIH NATURAL & MENYATU */}
            <section className="flex mx-40 py-[85px]">
            <div className="bg-white/90 backdrop-blur-sm border border-[#1E3A8A]/10 w-[520px] rounded-[18px] shadow-[0px_8px_24px_rgba(0,0,0,0.08)] px-[42px] py-[48px]">
                <h1 className="text-[42px] font-[700] leading-[52px] text-[#111111]">
                Jual Beli Barang <br /> Bekas
                </h1>
                <p className="text-[42px] font-[700] text-[#FED7AA] mt-[6px]">
                Lebih Mudah
                </p>
                <p className="text-[#6F6F6F] text-[15px] leading-[24px] mt-[14px]">
                Platform terpercaya untuk menemukan barang berkualitas dengan harga
                terjangkau atau menjual barang Anda dengan cepat dan aman.
                </p>

                <div className="flex gap-[16px] mt-[32px]">
                <button 
                    className="bg-[#1E3A8A] text-white rounded-[10px] text-[15px] font-[500] w-[200px] h-[46px] hover:opacity-90"
                    onClick={() => navigate("/login")}
                >
                    Mulai Jual Beli
                </button>
                <button 
                    className="border border-[#1E3A8A] text-[#1E3A8A] rounded-[10px] text-[15px] font-[500] w-[150px] h-[46px] hover:bg-[#1E3A8A] hover:text-white transition"
                    onClick={() => navigate("/signup")}
                >
                    Buat Akun
                </button>
                </div>
            </div>
            </section>

            {/* WHY CHOOSE - TRANSPARAN (GRADIEN TERLIHAT) */}
            <section className="bg-transparent pt-[65px] pb-[90px] text-center">
            <h2 className="text-[23px] font-[700] text-[#111111]">
                Mengapa Pilih ARTA MARKETPLACE?
            </h2>
            <p className="text-[15px] text-[#6F6F6F] mt-[8px] max-w-[560px] mx-auto leading-[24px]">
                Platform yang aman, mudah, dan terpercaya untuk semua kebutuhan jual beli Anda
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] max-w-[950px] mx-auto mt-[58px]">
                {[
                {
                    title: "Aman & Terpercaya",
                    text: "Sistem keamanan berlapis dan verifikasi pengguna untuk memastikan transaksi yang aman dan terpercaya.",
                    icon: ShieldCheck,
                    bgColor: "bg-[#FF9E7D]",
                },
                {
                    title: "Mudah Digunakan",
                    text: "Interface yang intuitif dan user-friendly memudahkan Anda untuk menjual atau membeli barang dengan cepat.",
                    icon: Smartphone,
                    bgColor: "bg-[#7FA8E3]",
                },
                {
                    title: "Dukungan 24/7",
                    text: "Tim customer service yang siap membantu Anda kapan saja untuk menyelesaikan masalah atau pertanyaan.",
                    icon: Headphones,
                    bgColor: "bg-[#7DDC8B]",
                },
                ].map((item, i) => {
                const IconComponent = item.icon;
                return (
                    <div
                    key={i}
                    className="border border-[#1E3A8A] rounded-[14px] p-[28px] bg-[#ffffff80] hover:shadow-[0px_6px_18px_rgba(0,0,0,0.07)] transition flex flex-col items-center text-center"
                    >
                    <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mb-4`}>
                        <IconComponent size={24} className="text-white" />
                    </div>
                    <h3 className="text-[18px] font-[600] text-black mb-[8px]">{item.title}</h3>
                    <p className="text-[14px] text-[#6F6F6F] leading-[22px]">{item.text}</p>
                    </div>
                );
                })}
            </div>
            </section>

            {/* CATEGORIES - TRANSPARAN (GRADIEN TERLIHAT) */}
            <section className="bg-transparent pt-[35px] pb-[88px] text-center">
            <h2 className="text-[23px] font-[700] text-[#111111]">Siap Memulai Jual Beli?</h2>
            <p className="text-[15px] text-[#6F6F6F] mt-[8px] max-w-[520px] mx-auto leading-[24px]">
                Temukan berbagai kategori barang bekas berkualitas dengan harga terbaik
            </p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-[50px] max-w-[950px] mx-auto mt-[55px]">
                {[
                { name: "Elektronik", total: "128+", icon: Tv },
                { name: "Rumah Tangga", total: "78+", icon: Home },
                { name: "Fashion", total: "96+", icon: Shirt },
                { name: "Aksesoris", total: "54+", icon: Gem },
                ].map((item, i) => {
                const IconComponent = item.icon;
                return (
                    <div
                    key={i}
                    className="border border-[#1E3A8A] bg-[#ffffff80] rounded-[14px] p-[26px] hover:shadow-[0px_4px_11px_rgba(0,0,0,0.07)] flex flex-col items-center text-center"
                    >
                    <div className="w-12 h-12 bg-[#DDE7FF] rounded-full flex items-center justify-center mb-4">
                        <IconComponent size={24} className="text-[#1E3A8A]" />
                    </div>
                    <h3 className="text-black font-[600] text-[17px]">{item.name}</h3>
                    <p className="text-[#6F6F6F] text-[13px] mt-[6px]">{item.total} Produk</p>
                    </div>
                );
                })}
            </div>
            </section>

            {/* CTA - BIRU TUA SOLID (KONTRAS) */}
            <section className="bg-[#1E3A8A] text-white text-center py-[92px] px-4">
            <h2 className="text-[27px] font-[700]">Siap Memulai Jual Beli?</h2>
            <p className="text-[15px] mt-[10px] max-w-[560px] mx-auto leading-[24px] text-[#EAEAEA]">
                Bergabunglah dengan ribuan pengguna yang sudah merasakan kemudahan bertransaksi di ARTA MARKETPLACE
            </p>

            <div className="flex gap-[16px] mt-[38px] justify-center">
                <button 
                className="bg-[#FED7AA] text-[#1E3A8A] font-[600] text-[15px] rounded-[10px] w-[160px] h-[46px] hover:opacity-90"
                onClick={() => navigate("/signup")}
                >
                Daftar Sekarang
                </button>
                <button 
                className="border border-white text-white font-[500] text-[15px] rounded-[10px] w-[160px] h-[46px] hover:bg-white hover:text-[#1E3A8A] transition"
                onClick={() => navigate("/login")}
                >
                Sudah Punya Akun
                </button>
            </div>
            </section>
        </div>
        <Footer/>
        </>
    );
    }