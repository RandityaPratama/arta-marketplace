    // src/components/SearchBar.js
    import React from "react";
    import { useNavigate } from "react-router-dom";

    export default function SearchBar() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col md:flex-row gap-6 mb-12">
        {/* Search Bar */}
        <div className="flex-1">
            <div className="relative">
            <input
                type="text"
                placeholder="Cari produk..."
                className="w-full px-5 py-3 text-[15px] border border-[#1E3A8A] rounded-lg focus:outline-none transition focus:ring-2 focus:ring-[#1E3A8A]"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="absolute left-5 top-3 w-5 h-5"
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m-2.803-2.803a7 7 0 00-10.606 10.606l5.197 5.197M21 21l-5.197-5.197" />
            </svg>
            </div>
        </div>

        {/* Category Dropdown */}
        <div className="md:w-[220px]">
            <select className="w-full px-5 py-3 text-[15px] border border-[#1E3A8A] rounded-lg transition focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]">
            <option>Semua kategori</option>
            <option>Elektronik</option>
            <option>Rumah Tangga</option>
            <option>Olahraga</option>
            <option>Furnitur</option>
            </select>
        </div>
        </div>
    );
    }