# 🚀 Panduan Implementasi Midtrans Selanjutnya

File ini berisi daftar perintah (prompts) yang bisa Anda copy-paste ke saya untuk melanjutkan proses integrasi Midtrans langkah demi langkah.

## ✅ Status Saat Ini
- Migration `transactions` sudah diedit.
- Migration `payment_logs` sudah diedit.
- **PENTING:** Pastikan Anda sudah menjalankan `php artisan migrate` di terminal sebelum lanjut.

---

## 📋 Langkah 1: Setup Model & Relasi
Kita perlu membuat Model agar Laravel bisa berinteraksi dengan tabel yang baru dibuat.

**👉 Perintah untuk Saya (Copy ini):**
> "Buatkan Model Transaction dan PaymentLog. Pastikan relasi ke User (pembeli/penjual) dan Product didefinisikan dengan benar. Tambahkan juga fillable fields sesuai migration yang tadi kita buat."

## 📋 Langkah 2: Setup Controller & Logika Checkout
Kita butuh Controller untuk menangani proses Checkout (membuat transaksi di DB & meminta Snap Token ke Midtrans).

**👉 Perintah untuk Saya (Copy ini):**
> "Buatkan TransactionController. Saya butuh fungsi `checkout` untuk membuat transaksi baru dan meminta Snap Token ke Midtrans. Gunakan library midtrans-php atau HTTP client biasa. Pastikan Server Key diambil dari .env."

## 📋 Langkah 3: Setup Webhook (Callback) Handler
Ini bagian krusial agar status pembayaran di database otomatis berubah saat user selesai membayar.

**👉 Perintah untuk Saya (Copy ini):**
> "Buatkan fungsi `notificationHandler` di TransactionController untuk menangani Webhook dari Midtrans. Logika ini harus bisa mengupdate status transaksi (pending -> paid/expire) dan mencatat log ke tabel payment_logs."

## 📋 Langkah 4: Integrasi Frontend (Tombol Beli)
Menghubungkan tombol "Beli Sekarang" dengan API Checkout dan memunculkan popup pembayaran.

**👉 Perintah untuk Saya (Copy ini):**
> "Update file `ProductDetailPage.jsx`. Ubah tombol 'Beli Sekarang' agar memanggil API checkout, lalu munculkan popup Midtrans Snap menggunakan token yang didapat. Tolong handle cara load script Snap.js secara dinamis."

## 📋 Langkah 5: Integrasi Frontend (Riwayat Transaksi)
Menampilkan data transaksi nyata di halaman riwayat.

**👉 Perintah untuk Saya (Copy ini):**
> "Update file `PurchaseHistoryPage.jsx`. Fetch data transaksi dari API backend dan tampilkan status pembayaran yang sesuai (Pending, Berhasil, Gagal) serta tombol 'Bayar' jika status masih pending."

---
**Saran:** Silakan mulai dengan **Langkah 1** sekarang.