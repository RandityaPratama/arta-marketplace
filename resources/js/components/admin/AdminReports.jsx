    // src/pages/admin/AdminDashboard.js
    import React, { useState } from "react";
        import { useNavigate } from "react-router-dom";
        import AdminLayout from "./AdminLayout";
        import Button from "../ui/Button"

    export default function AdminReports() {
    const [reports] = useState([
        { id: 1, product: "iPhone 15 Curian", reporter: "Andi", reportedDate: "2 jam lalu", reason: "Barang ilegal", status: "Menunggu" },
        { id: 2, product: "Laptop ASUS Palsu", reporter: "Budi", reportedDate: "5 jam lalu", reason: "Deskripsi menipu", status: "Diproses" },
        { id: 3, product: "Sepatu Nike KW", reporter: "Citra", reportedDate: "1 hari lalu", reason: "Foto tidak sesuai", status: "Selesai" },
    ]);

    return (
        <AdminLayout active="Laporan">
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan Pelanggaran</h2>

            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produk</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pelapor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{report.product}</td>
                    <td className="px-6 py-4 text-gray-700">{report.reporter}</td>
                    <td className="px-6 py-4 text-gray-700">{report.reportedDate}</td>
                    <td className="px-6 py-4 text-gray-700">{report.reason}</td>
                    <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === "Menunggu" ? "bg-yellow-100 text-yellow-800" :
                        report.status === "Diproses" ? "bg-blue-100 text-blue-800" :
                        "bg-green-100 text-green-800"
                        }`}>
                        {report.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {report.status === "Menunggu" && (
                        <>
                            <Button variant="primary" size="sm" className="mr-2">Proses</Button>
                            <Button variant="danger" size="sm">Tolak</Button>
                        </>
                        )}
                        {report.status === "Diproses" && (
                        <Button variant="primary" size="sm">Selesaikan</Button>
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