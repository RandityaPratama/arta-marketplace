// components/admin/AdminLayout.js
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, Users, Package, Flag, BarChart3, Settings, User, Activity } from "lucide-react";
import { useAdminAuth } from "./admincontext/AdminAuthContext";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const { adminLogout } = useAdminAuth();

  useEffect(() => {
    const saved = localStorage.getItem("admin_profile");
    if (saved) {
      const profile = JSON.parse(saved);
      setAdminName(profile.name || "Admin");
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const menuItems = [
    { name: "Dashboard", icon: BarChart3, path: "/admin/dashboard" },
    { name: "Activity", icon: Activity, path: "/admin/activity" },
    { name: "Pengguna", icon: Users, path: "/admin/users" },
    { name: "Produk", icon: Package, path: "/admin/products" },
    { name: "Laporan", icon: Flag, path: "/admin/reports" },
    { name: "Pengaturan", icon: Settings, path: "/admin/settings" },
  ];

  const handleLogout = async () => {
    await adminLogout();
  };

  return (
    <div className="font-[Poppins] bg-gray-50 min-h-screen flex">
      {/* Sidebar - FIXED */}
      {isSidebarOpen && (
        <div className="w-64 bg-[#1E3A8A] text-white fixed min-h-screen p-4 z-10">
          <div className="flex items-center text-center gap-2 mb-10 mt-2">
            <span className="font-bold text-md">RARENSELL MARKETPLACE</span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive(item.path)
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-0 md:ml-64">
        {/* Header - FIXED */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 fixed top-0 right-0 left-0 md:left-64 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">
              {menuItems.find(item => isActive(item.path))?.name || "Admin"}
            </h1>
            
            {/* ✅ Hanya tampilkan profil (tanpa notifikasi) */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/admin/profile")}>
              <div className="w-10 h-10 bg-[#DDE7FF] rounded-full flex items-center justify-center">
                <span className="text-[#1E3A8A] font-bold">A</span>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-gray-800">{adminName}</p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6 pt-20 md:pt-28">{children}</main>
      </div>
    </div>
  );
}