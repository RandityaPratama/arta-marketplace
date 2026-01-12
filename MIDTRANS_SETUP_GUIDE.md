# 🛠️ Panduan Setup Awal Midtrans

Ikuti langkah-langkah ini secara berurutan untuk menyiapkan lingkungan kerja sebelum coding.

## 1. Daftar & Ambil Kunci API (Sandbox)
Kita akan menggunakan mode **Sandbox** (Test Mode) terlebih dahulu.

1. Buka [Midtrans Passport Register](https://dashboard.sandbox.midtrans.com/register).
2. Daftar akun baru atau login.
3. Masuk ke Dashboard.
4. Pergi ke menu **Settings** > **Access Keys**.
5. Anda akan melihat:
   - **Merchant ID**
   - **Client Key**
   - **Server Key**
   *(Biarkan tab ini terbuka, kita butuh datanya untuk langkah 3)*.

---

## 2. Install Library Midtrans di Laravel
Buka terminal di project `arta-marketplace` Anda dan jalankan perintah ini:

```bash
composer require midtrans/midtrans-php
```

---

## 3. Konfigurasi Environment (.env)
Buka file `.env` di project Anda, lalu tambahkan konfigurasi berikut di bagian paling bawah.
**Copy-paste kode di bawah ini dan isi dengan data dari Langkah 1:**

```env
# MIDTRANS CONFIGURATION
MIDTRANS_MERCHANT_ID=Ganti_Dengan_Merchant_ID_Anda
MIDTRANS_CLIENT_KEY=Ganti_Dengan_Client_Key_Anda
MIDTRANS_SERVER_KEY=Ganti_Dengan_Server_Key_Anda
VITE_MIDTRANS_CLIENT_KEY=Ganti_Dengan_Client_Key_Anda
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_IS_SANITIZED=true
MIDTRANS_IS_3DS=true
```

> **Catatan:** Pastikan `MIDTRANS_IS_PRODUCTION=false` selama masa testing.

---

## 4. Konfigurasi Webhook (Notification URL)
Agar status pembayaran di database otomatis berubah (misal: dari Pending ke Paid), Midtrans perlu mengirim sinyal ke aplikasi kita.

1. Di Dashboard Midtrans, buka **Settings** > **Configuration**.
2. Cari kolom **Payment Notification URL**.
3. Masukkan URL endpoint aplikasi kita.
   - **Jika di Localhost:** Anda tidak bisa menggunakan `localhost:8000`. Anda harus menggunakan **Ngrok** atau sejenisnya untuk mengekspos localhost ke internet.
   - Contoh URL Ngrok: `https://abcd-1234.ngrok-free.app/api/midtrans/notification`
   - **Jika belum pakai Ngrok:** Kosongkan dulu tidak apa-apa, nanti kita test manual atau install Ngrok belakangan.

---

## 5. Bypass CSRF untuk Webhook
Midtrans akan mengirim data POST ke aplikasi kita. Laravel secara default memblokir POST request dari luar jika tidak ada CSRF Token. Kita perlu mengecualikan route Midtrans.

Buka file `bootstrap/app.php` dan tambahkan pengecualian pada `validateCsrfTokens`:

```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->validateCsrfTokens(except: [
        'api/midtrans/notification', // 👈 Tambahkan baris ini
    ]);
})
```

---

## 6. Update Config (Opsional tapi Rapi)
Buat file konfigurasi agar kita mudah memanggilnya di kode nanti.
Buat file baru: `config/midtrans.php`

```php
<?php

return [
    'merchant_id' => env('MIDTRANS_MERCHANT_ID'),
    'client_key' => env('MIDTRANS_CLIENT_KEY'),
    'server_key' => env('MIDTRANS_SERVER_KEY'),
    'is_production' => env('MIDTRANS_IS_PRODUCTION', false),
    'is_sanitized' => env('MIDTRANS_IS_SANITIZED', true),
    'is_3ds' => env('MIDTRANS_IS_3DS', true),
];
```