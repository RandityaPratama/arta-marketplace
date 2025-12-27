    import React from "react";
    import { useNavigate } from "react-router-dom";
    // ✅ Import ikon dari lucide-react (kecuali Twitter)
    import { Instagram, Facebook } from "lucide-react";

    // ✅ SVG Custom untuk Logo X
    const XIcon = ({ size = 20, className = "" }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        className={className}
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
    );

    export default function Footer() {
    return (
        <footer className="w-full bg-[#0E1420] text-white pt-12 pb-6 px-6 md:px-20 font-poppins">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Brand Section */}
            <div>
            <h2 className="font-bold text-xl text-[#F4C18E]">ARTA MARKETPLACE</h2>
            <p className="text-sm text-gray-300 mt-4 leading-relaxed w-72">
                Platform terpercaya untuk jual beli barang bekas dengan sistem keamanan terjamin dan kemudahan bertransaksi.
            </p>

            {/* Sosial Media */}
            <div className="flex items-center space-x-4 mt-4">
                <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1A2433] p-2 rounded-md cursor-pointer hover:bg-[#2A3443] transition text-[#E1306C]"
                aria-label="Instagram"
                >
                <Instagram size={20} />
                </a>
                <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1A2433] p-2 rounded-md cursor-pointer hover:bg-[#2A3443] transition text-[#000000]"
                aria-label="X"
                >
                <XIcon size={20} />
                </a>
                <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#1A2433] p-2 rounded-md cursor-pointer hover:bg-[#2A3443] transition text-[#4267B2]"
                aria-label="Facebook"
                >
                <Facebook size={20} />
                </a>
            </div>
            </div>

            {/* Kategori */}
            <div>
            <h3 className="font-bold text-base text-lg text-[#FFFFFF]">Kategori</h3>
            <ul className="text-sm text-gray-300 space-y-3 mt-4">
                <li className="cursor-pointer hover:text-white">Elektronik</li>
                <li className="cursor-pointer hover:text-white">Rumah Tangga</li>
                <li className="cursor-pointer hover:text-white">Olahraga</li>
                <li className="cursor-pointer hover:text-white">Hobi</li>
            </ul>
            </div>

            {/* Bantuan */}
            <div>
            <h3 className="font-bold text-base text-lg text-[#FFFFFF]">Bantuan</h3>
            <ul className="text-sm text-gray-300 space-y-3 mt-4">
                <li className="cursor-pointer hover:text-white">Pusat Bantuan</li>
                <li className="cursor-pointer hover:text-white">Syarat & Ketentuan</li>
                <li className="cursor-pointer hover:text-white">Kebijakan Privasi</li>
                <li className="cursor-pointer hover:text-white">Hubungi Kami</li>
            </ul>
            </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-4 text-center">
            <p className="text-xs text-gray-400">© 2025 ARTA MARKETPLACE. Semua hak dilindungi.</p>
        </div>
        </footer>
    );
    }