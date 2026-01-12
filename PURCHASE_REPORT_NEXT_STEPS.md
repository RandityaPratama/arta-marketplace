# 🚀 Panduan Implementasi Laporan Pembelian (Purchase Report)

File ini berisi daftar perintah yang bisa Anda copy-paste ke saya untuk melanjutkan pembuatan fitur Laporan Pembelian.

## 📋 Langkah 1: Update Database & Model
Kita perlu membedakan antara laporan iklan (produk melanggar aturan) dan laporan pembelian (penipuan/barang tidak dikirim). Kita akan menambahkan kolom ke tabel `reports`.

**👉 Perintah untuk Saya (Copy ini):**
> "Buatkan file migration untuk menambahkan kolom `transaction_id` (nullable) dan `report_type` (enum: 'iklan', 'transaksi') ke tabel `reports`. Update juga Model `Report` agar kolom-kolom tersebut masuk ke `$fillable` dan tambahkan relasi ke model `Transaction`."

---

## 📋 Langkah 2: Update Backend Controller
Backend perlu logika untuk menyimpan jenis laporan yang berbeda dan memfilternya untuk Admin.

**👉 Perintah untuk Saya (Copy ini):**
> "Update `UserReportController.php` agar fungsi `store` bisa menerima `transaction_id` dan menentukan `report_type`. Lalu update `AdminReportController.php` agar fungsi `index` bisa memfilter laporan berdasarkan parameter `type` ('iklan' atau 'transaksi') dari request API."

---

## 📋 Langkah 3: Update Frontend Context
Context di React perlu diperbarui agar bisa mengirim data transaksi saat melapor.

**👉 Perintah untuk Saya (Copy ini):**
> "Update file `resources/js/components/context/ReportContext.jsx`. Ubah fungsi `submitReport` agar menerima parameter tambahan `transactionId` dan `reportType`, lalu kirimkan data tersebut ke API."

---

## 📋 Langkah 4: Update Halaman Riwayat Pembelian (User)
Menghubungkan tombol "Laporkan" di riwayat pembelian dengan logika baru.

**👉 Perintah untuk Saya (Copy ini):**
> "Update file `PurchaseHistoryPage.jsx`. Ubah logika tombol 'Laporkan' agar saat diklik, ia mengirimkan `transaction_id` dan `reportType='transaksi'` ke fungsi `submitReport`."

---

## 📋 Langkah 5: Update Halaman Admin (Admin)
Menampilkan laporan pembelian di tab yang sesuai pada dashboard Admin.

**👉 Perintah untuk Saya (Copy ini):**
> "Update file `AdminReports.jsx`. Implementasikan logika pada tab 'Laporan Pembelian' agar mengambil data dari API dengan filter `type=transaksi`. Tampilkan kolom yang relevan seperti Order ID dan Status Transaksi, serta aktifkan tombol aksi yang sesuai."

---
**Saran:** Silakan mulai dengan **Langkah 1** sekarang.