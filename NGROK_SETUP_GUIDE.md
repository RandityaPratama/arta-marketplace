# 🌐 Panduan Setup Ngrok untuk Midtrans Webhook

Karena Midtrans berada di internet dan aplikasi Laravel Anda berada di laptop (localhost), Midtrans tidak bisa mengirim notifikasi pembayaran secara langsung. **Ngrok** adalah jembatan yang membuat localhost Anda bisa diakses dari internet sementara.

## 1. Download & Install Ngrok
1. Kunjungi [ngrok.com/download](https://ngrok.com/download).
2. Download versi **Windows**.
3. Extract file zip tersebut (biasanya berisi `ngrok.exe`).
4. (Opsional tapi disarankan) Daftar akun di Ngrok untuk mendapatkan Authtoken agar sesi tidak expired terlalu cepat.

## 2. Jalankan Ngrok
1. Pastikan Laravel Anda sedang berjalan di terminal lain:
   ```bash
   php artisan serve
   ```
   *(Biasanya berjalan di port 8000)*.

2. Buka terminal baru (Command Prompt atau PowerShell).
3. Jalankan perintah Ngrok:
   ```bash
   ngrok http 8000
   ```
   *(Jika `ngrok` belum masuk path environment variable, Anda perlu masuk ke folder tempat `ngrok.exe` berada dulu)*.

## 3. Dapatkan Public URL
Setelah perintah di atas dijalankan, Anda akan melihat tampilan seperti ini di terminal:

```
Forwarding                    https://a1b2-c3d4.ngrok-free.app -> http://localhost:8000
```

Copy URL yang berawalan `https://` (contoh: `https://a1b2-c3d4.ngrok-free.app`).

## 4. Konfigurasi di Midtrans Dashboard (Langkah 4)
1. Login ke Midtrans Dashboard (Sandbox).
2. Masuk ke menu **Settings** > **Configuration**.
3. Cari kolom **Payment Notification URL**.
4. Masukkan URL lengkap endpoint notifikasi kita dengan format:
   `[URL_NGROK]/api/midtrans/notification`
   
   Contoh:
   ```
   https://a1b2-c3d4.ngrok-free.app/api/midtrans/notification
   ```
5. Klik **Update**.

## ✅ Selesai!
Sekarang Midtrans bisa "melihat" aplikasi lokal Anda.

> **Catatan:** Setiap kali Anda mematikan Ngrok dan menyalakannya lagi, URL-nya akan berubah. Anda harus mengupdate URL di Dashboard Midtrans lagi.