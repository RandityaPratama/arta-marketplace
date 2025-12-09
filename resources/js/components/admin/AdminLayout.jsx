    // src/components/AdminLayout.js
    import React, { useState } from "react";
    import { useNavigate, Link } from "react-router-dom";
    import { LogOut, Users, Package, Flag, BarChart3, Settings } from "lucide-react";

    export default function AdminLayout({ children, active }) {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const menuItems = [
        { name: "Dashboard", icon: BarChart3, path: "/admin" },
        { name: "Pengguna", icon: Users, path: "/admin/users" },
        { name: "Produk", icon: Package, path: "/admin/products" },
        { name: "Laporan", icon: Flag, path: "/admin/reports" },
        { name: "Pengaturan", icon: Settings, path: "/admin/settings" },
    ];

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        navigate("/login");
    };

    return (
        <div className="font-[Poppins] bg-gray-50 min-h-screen flex">
        {/* Sidebar */}
        {isSidebarOpen && (
            <div className="w-64 bg-[#1E3A8A] text-white min-h-screen p-4">
            <div className="flex items-center gap-2 mb-10 mt-2">
                <div className="bg-[#FED7AA] p-1.5 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-6 h-6">
                    <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
                </div>
                <span className="font-bold text-xl">ADMIN</span>
            </div>

            <nav className="space-y-2">
                {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        active === item.name
                        ? "bg-white text-[#1E3A8A] font-medium"
                        : "text-white hover:bg-[#162e68]"
                    }`}
                    >
                    <Icon size={20} />
                    <span>{item.name}</span>
                    </Link>
                );
                })}
            </nav>

            <div className="absolute bottom-4 w-52">
                <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-[#162e68] rounded-lg transition"
                >
                <LogOut size={20} />
                <span>Logout</span>
                </button>
            </div>
            </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
            <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                    <span className="text-[#1E3A8A] font-bold">A</span>
                </div>
                <span>Admin</span>
                </div>
            </div>
            </header>

            <main className="p-6">{children}</main>
        </div>
        </div>
    );
    }