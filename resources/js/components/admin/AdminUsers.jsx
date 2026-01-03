    // components/admin/AdminUsers.js
    import React, { useState, useEffect } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button";
    import { AdminUserProvider, useAdminUser } from "./admincontext/AdminUserContext";

    function AdminUsersContent() {
    const navigate = useNavigate();
    const { users, loading, fetchUsers, updateUserStatus } = useAdminUser();
    const [searchTerm, setSearchTerm] = useState("");

    // ✅ Fetch data saat search berubah
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchUsers(1, searchTerm);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, fetchUsers]);

    const handleUserClick = (userId) => {
        navigate(`/admin/user/${userId}`);
    };

    const handleStatusChange = async (userId, currentStatus) => {
        const newStatus = currentStatus === "Aktif" ? "Diblokir" : "Aktif";
        const confirmMessage = newStatus === "Diblokir" 
            ? "Apakah Anda yakin ingin memblokir pengguna ini?" 
            : "Aktifkan kembali pengguna ini?";
        
        if (window.confirm(confirmMessage)) {
            const result = await updateUserStatus(userId, newStatus);
            if (!result.success) {
                alert(result.message);
            }
        }
    };

    return (
        <AdminLayout active="Pengguna">
        <div>
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
            <div className="flex gap-3">
                <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari pengguna..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
                <Button variant="primary" size="md" onClick={() => fetchUsers(1, searchTerm)}>Cari</Button>
            </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            {loading ? (
                <div className="text-center py-12 text-gray-500">Memuat data pengguna...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-12 text-gray-500">Tidak ada pengguna ditemukan.</div>
            ) : (
                <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bergabung</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button
                        onClick={() => handleUserClick(user.id)}
                        className="font-medium text-[#1E3A8A] hover:underline"
                        >
                        {user.name}
                        </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        {/* ✅ Badge STATUS dengan lebar sama */}
                        <span 
                        className={`min-w-[76px] px-3 py-1 rounded-full text-xs font-medium text-center inline-block ${
                            user.status === "Aktif" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}
                        >
                        {user.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{user.joined}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.status === "Aktif" ? (
                        <Button variant="danger" className="px-5.5" size="sm" onClick={() => handleStatusChange(user.id, user.status)}>Blokir</Button>
                        ) : (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(user.id, user.status)}>Aktifkan</Button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            )}
            </div>
        </div>
        </AdminLayout>
    );
    }

    export default function AdminUsers() {
        return (
            <AdminUserProvider>
                <AdminUsersContent />
            </AdminUserProvider>
        );
    }