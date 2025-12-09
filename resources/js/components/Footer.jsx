import React from "react";
    import { useNavigate } from "react-router-dom";

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

            <div className="flex items-center space-x-4 mt-4">
                <a className="bg-[#1A2433] p-2 rounded-md cursor-pointer"></a>
                <a className="bg-[#1A2433] p-2 rounded-md cursor-pointer"></a>
                <a className="bg-[#1A2433] p-2 rounded-md cursor-pointer"></a>
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
