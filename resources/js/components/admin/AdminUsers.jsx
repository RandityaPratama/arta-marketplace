    // components/admin/AdminUsers.js
    import React, { useState } from "react";
    import { useNavigate } from "react-router-dom";
    import AdminLayout from "./AdminLayout";
    import Button from "../ui/Button";

    export default function AdminUsers() {
    const navigate = useNavigate();
    const [users] = useState([
        { id: 1, name: "Randitya Pratama", email: "randi@example.com", status: "Aktif", joined: "12 Jan 2025" },
        { id: 2, name: "Budi Santoso", email: "budi@example.com", status: "Aktif", joined: "3 Feb 2025" },
        { id: 3, name: "Dina Putri", email: "dina@example.com", status: "Diblokir", joined: "15 Mar 2025" },
        { id: 4, name: "Eko Wijaya", email: "eko@example.com", status: "Aktif", joined: "22 Apr 2025" },
    ]);

    const handleUserClick = (userId) => {
        navigate(`/admin/user/${userId}`);
    };

    return (
        <AdminLayout active="Pengguna">
        <div>
            <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h2>
            <div className="flex gap-3">
                <input
                type="text"
                placeholder="Cari pengguna..."
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
                />
                <Button variant="primary" size="md">Filter</Button>
            </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
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
                        <Button variant="danger"  className="px-5.5" size="sm">Blokir</Button>
                        ) : (
                        <Button variant="outline" size="sm">Aktifkan</Button>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        </AdminLayout>
    );
    }