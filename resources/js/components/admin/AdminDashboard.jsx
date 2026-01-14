import React, { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import TabNavigation from "./TabNavigation";
import AdminUsersContentOnly from "./AdminUsersContentOnly";
import AdminProductsContentOnly from "./AdminProductsContentOnly";
import AdminReportsContentOnly from "./AdminReportsContentOnly";
import AdminActivityContentOnly from "./AdminActivityContentOnly";
import AdminSettingsContentOnly from "./AdminSettingsContentOnly";
import { AdminUserProvider } from "./admincontext/AdminUserContext";
import { AdminProductProvider } from "./admincontext/AdminProductContext";
import { AdminActivityProvider } from "./admincontext/AdminActivityContext";
import { AdminSettingProvider } from "./admincontext/AdminSettingContext";

// Loading Skeleton Component
function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
      <div className="h-8 bg-gray-200 rounded w-1/2 mb-3"></div>
      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
}

function OverviewContent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchDashboardData();
  }, [retryCount]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('admin_token');
      
      if (!token) {
        setError('Token tidak ditemukan. Silakan login kembali.');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/admin/dashboard/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDashboardData(result.data);
          setError(null);
        } else {
          setError('Gagal memuat data dashboard');
        }
      } else if (response.status === 401) {
        setError('Sesi Anda telah berakhir. Silakan login kembali.');
      } else if (response.status === 403) {
        setError('Anda tidak memiliki akses ke halaman ini.');
      } else {
        setError(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        setError('Terjadi kesalahan: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num || 0);
  };

  const stats = dashboardData ? [
    { 
      title: "Total Pengguna", 
      value: formatNumber(dashboardData.stats.total_users), 
      change: dashboardData.stats.total_users_change.formatted + " dari bulan lalu",
      isIncrease: dashboardData.stats.total_users_change.is_increase
    },
    { 
      title: "Produk Aktif", 
      value: formatNumber(dashboardData.stats.active_products), 
      change: dashboardData.stats.active_products_change.formatted + " dari bulan lalu",
      isIncrease: dashboardData.stats.active_products_change.is_increase
    },
    { 
      title: "Produk Terjual", 
      value: formatNumber(dashboardData.stats.sold_products), 
      change: dashboardData.stats.sold_products_change.formatted + " dari bulan lalu",
      isIncrease: dashboardData.stats.sold_products_change.is_increase
    },
    { 
      title: "Pengguna Aktif (Minggu Ini)", 
      value: formatNumber(dashboardData.stats.active_users_week), 
      change: dashboardData.stats.active_users_change.formatted + " dari minggu lalu",
      isIncrease: dashboardData.stats.active_users_change.is_increase
    },
  ] : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

      {loading ? (
        <>
          {/* Loading Skeleton for Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>

          {/* Loading Skeleton for Recent Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="font-semibold text-lg">Gagal Memuat Data Dashboard</p>
              <p className="text-sm mt-2 text-red-600">{error}</p>
              {retryCount > 0 && (
                <p className="text-xs mt-1 text-gray-500">Percobaan ke-{retryCount + 1}</p>
              )}
            </div>
            <div className="flex gap-3 justify-center mt-6">
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-[#1E3A8A] text-white rounded-lg hover:bg-[#152d6b] transition-colors font-medium"
              >
                🔄 Coba Lagi
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                ↻ Refresh Halaman
              </button>
            </div>
            <div className="mt-6 text-left bg-white rounded-lg p-4 border border-red-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">💡 Tips Troubleshooting:</p>
              <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                <li>Periksa koneksi internet Anda</li>
                <li>Pastikan server Laravel sedang berjalan</li>
                <li>Coba logout dan login kembali</li>
                <li>Bersihkan cache browser (Ctrl+Shift+Del)</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${
                  stat.isIncrease ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.isIncrease ? (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Activity and Latest Products */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Aktivitas Terbaru */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Aktivitas Terbaru ({dashboardData?.recent_activities?.length || 0})
              </h3>
              {dashboardData?.recent_activities && dashboardData.recent_activities.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recent_activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      {activity.important ? (
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                      ) : (
                        <div className="w-2 h-2 bg-[#1E3A8A] rounded-full mt-2"></div>
                      )}
                      <div>
                        <p className="text-gray-800 text-sm">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada aktivitas terbaru</p>
              )}
            </div>

            {/* Produk Terbaru */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Produk Terbaru ({dashboardData?.latest_products?.length || 0})
              </h3>
              {dashboardData?.latest_products && dashboardData.latest_products.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.latest_products.map((product, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-800 text-sm">{product.name}</h4>
                        <p className="text-xs text-gray-600">Oleh {product.seller}</p>
                      </div>
                      <span className="text-xs text-gray-500">{product.time}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Belum ada produk terbaru</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "users", label: "Users" },
    { id: "products", label: "Products" },
    { id: "reports", label: "Reports" },
    { id: "activity", label: "Activity" },
    { id: "settings", label: "Settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent />;
      case "users":
        return <AdminUsersContentOnly />;
      case "products":
        return <AdminProductsContentOnly />;
      case "reports":
        return <AdminReportsContentOnly />;
      case "activity":
        return <AdminActivityContentOnly />;
      case "settings":
        return <AdminSettingsContentOnly />;
      default:
        return <OverviewContent />;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

        <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} />

        <div className="mt-6">
          {activeTab === "users" ? (
            <AdminUserProvider>
              {renderContent()}
            </AdminUserProvider>
          ) : activeTab === "products" ? (
            <AdminProductProvider>
              {renderContent()}
            </AdminProductProvider>
          ) : activeTab === "activity" ? (
            <AdminActivityProvider>
              {renderContent()}
            </AdminActivityProvider>
          ) : activeTab === "settings" ? (
            <AdminSettingProvider>
              {renderContent()}
            </AdminSettingProvider>
          ) : (
            renderContent()
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
