    // components/SearchBar.js
    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import { 
    Search, 
    Smartphone, 
    Home, 
    Dumbbell, 
    Bed, 
    Package 
    } from "lucide-react";

    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

    export default function SearchBar({ onSearch, onCategoryChange }) {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Semua kategori");
    const [categories, setCategories] = useState(["Semua kategori"]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // ✅ Mapping kategori ke ikon
    const getCategoryIcon = (category) => {
        switch (category) {
        case "Elektronik":
            return <Smartphone size={16} className="text-[#1E3A8A]" />;
        case "Rumah Tangga":
            return <Home size={16} className="text-[#1E3A8A]" />;
        case "Olahraga":
            return <Dumbbell size={16} className="text-[#1E3A8A]" />;
        case "Furnitur":
            return <Bed size={16} className="text-[#1E3A8A]" />;
        case "Semua kategori":
            return <Package size={16} className="text-gray-500" />;
        default:
            return <Package size={16} className="text-gray-500" />;
        }
    };

    // ✅ Fetch kategori dari API Database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_URL}/categories`);
                const result = await response.json();
                if (result.success) {
                    setCategories(["Semua kategori", ...result.data.map(c => c.name)]);
                }
            } catch (e) {
                console.error("Gagal mengambil kategori", e);
            }
        };
        fetchCategories();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (onSearch) {
        onSearch(searchTerm, selectedCategory);
        } else {
        navigate(`/search?q=${encodeURIComponent(searchTerm)}&category=${encodeURIComponent(selectedCategory)}`);
        }
    };

    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
        if (onCategoryChange) {
        onCategoryChange(value);
        }
        setIsDropdownOpen(false);
    };

    return (
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-6 mb-12">
        {/* Search Bar */}
        <div className="flex-1">
            <div className="relative">
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari produk..."
                className="w-full px-5 py-3 text-[15px] pl-12 border border-[#1E3A8A] rounded-lg focus:outline-none transition  focus:ring-[#1E3A8A]"
            />
            <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                size={20}
            />
            </div>
        </div>

        {/* Category Dropdown dengan Ikon */}
        <div className="md:w-[220px] relative">
            <div
            className="w-full px-5 py-3 text-[15px] border border-[#1E3A8A] rounded-lg cursor-pointer  flex items-center justify-between"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
            <div className="flex items-center gap-2">
                {getCategoryIcon(selectedCategory)}
                <span className="block truncate">{selectedCategory}</span>
            </div>
            <svg 
                className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            </div>

            {/* Dropdown Menu dengan Ikon */}
            {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-[#1E3A8A] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {categories.map((category, index) => (
                <div
                    key={index}
                    className={`px-5 py-3 cursor-pointer hover:bg-[#F0F7FF] flex items-center gap-3 ${
                    category === selectedCategory ? "bg-[#F0F7FF] font-medium" : ""
                    }`}
                    onClick={() => handleCategoryChange(category)}
                >
                    {getCategoryIcon(category)}
                    <span>{category}</span>
                </div>
                ))}
            </div>
            )}
        </div>
        </form>
    );
    }