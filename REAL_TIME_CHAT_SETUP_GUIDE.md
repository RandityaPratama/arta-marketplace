# 🚀 Panduan Setup Real-Time Chat - LENGKAP

## ✅ Yang Sudah Diimplementasikan

### Frontend (React):
- ✅ Laravel Echo & Pusher-js sudah ditambahkan ke `package.json`
- ✅ File `bootstrap.js` sudah dibuat untuk konfigurasi Echo
- ✅ `app.jsx` sudah import bootstrap.js
- ✅ `ChatContext.jsx` sudah memiliki real-time listeners untuk:
  - Event `message.sent` - Pesan baru
  - Event `message.updated` - Pesan diedit
  - Event `message.deleted` - Pesan dihapus
- ✅ `ChatRoom.jsx` sudah subscribe/unsubscribe otomatis

### Backend (Laravel):
- ✅ Events broadcasting sudah ada (`MessageSent`, `MessageUpdated`, `MessageDeleted`)
- ✅ Controller sudah memanggil `broadcast()` saat kirim pesan
- ✅ Channel authorization sudah dikonfigurasi di `routes/channels.php`

---

## 📋 Langkah-Langkah Setup (WAJIB DILAKUKAN)

### **Step 1: Install Dependencies**

Jalankan command ini di terminal:

```bash
npm install
```

Ini akan menginstall `laravel-echo` dan `pusher-js` yang sudah ditambahkan ke package.json.

---

### **Step 2: Setup Pusher (Pilihan 1 - Recommended)**

#### A. Daftar di Pusher
1. Buka [https://pusher.com](https://pusher.com)
2. Buat akun gratis
3. Buat aplikasi baru (New App)
4. Pilih cluster terdekat (contoh: `ap1` untuk Asia Pacific)
5. Dapatkan credentials:
   - App ID
   - Key
   - Secret
   - Cluster

#### B. Install Pusher PHP SDK
```bash
composer require pusher/pusher-php-server
```

#### C. Update file `.env`
Tambahkan/update baris berikut di file `.env`:

```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=your_app_id_here
PUSHER_APP_KEY=your_app_key_here
PUSHER_APP_SECRET=your_app_secret_here
PUSHER_APP_CLUSTER=ap1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

**⚠️ PENTING:** Ganti `your_app_id_here`, `your_app_key_here`, dll dengan credentials dari Pusher dashboard Anda!

#### D. Uncomment BroadcastServiceProvider
Buka file `config/app.php`, cari dan uncomment baris ini:

```php
App\Providers\BroadcastServiceProvider::class,
```

Jika file `BroadcastServiceProvider.php` tidak ada, buat dengan command:
```bash
php artisan make:provider BroadcastServiceProvider
```

---

### **Step 3: Setup Laravel Reverb (Pilihan 2 - Laravel 11+)**

Jika Anda menggunakan Laravel 11 atau lebih baru, Anda bisa menggunakan Laravel Reverb (gratis, self-hosted):

#### A. Install Reverb
```bash
php artisan install:broadcasting
```

#### B. Update `.env`
```env
BROADCAST_DRIVER=reverb

REVERB_APP_ID=my-app-id
REVERB_APP_KEY=my-app-key
REVERB_APP_SECRET=my-app-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http

VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST="${REVERB_HOST}"
VITE_REVERB_PORT="${REVERB_PORT}"
VITE_REVERB_SCHEME="${REVERB_SCHEME}"
```

#### C. Update `bootstrap.js`
Ganti isi file `resources/js/bootstrap.js` dengan:

```javascript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST,
    wsPort: import.meta.env.VITE_REVERB_PORT,
    wssPort: import.meta.env.VITE_REVERB_PORT,
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
        }
    }
});

export default window.Echo;
```

#### D. Start Reverb Server
Buka terminal baru dan jalankan:
```bash
php artisan reverb:start
```

**⚠️ PENTING:** Server Reverb harus tetap berjalan selama development!

---

### **Step 4: Setup CORS (Jika Ada Error)**

Jika Anda mendapat error CORS, update file `config/cors.php`:

```php
'paths' => ['api/*', 'broadcasting/auth', 'sanctum/csrf-cookie'],

'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

'supports_credentials' => true,
```

---

### **Step 5: Restart Services**

Setelah semua setup selesai:

1. **Stop semua service yang berjalan** (Ctrl+C di terminal)

2. **Restart Laravel server:**
   ```bash
   php artisan serve
   ```

3. **Restart Vite dev server:**
   ```bash
   npm run dev
   ```

4. **Jika pakai Reverb, start Reverb server:**
   ```bash
   php artisan reverb:start
   ```

---

## 🧪 Testing Real-Time Chat

### Test 1: Dengan 2 Browser Berbeda

1. **Browser 1 (Chrome):**
   - Login sebagai User A
   - Buka chat dengan User B
   - Buka Console (F12) untuk melihat log

2. **Browser 2 (Firefox/Incognito):**
   - Login sebagai User B
   - Buka chat dengan User A
   - Buka Console (F12) untuk melihat log

3. **Test Kirim Pesan:**
   - User A kirim pesan: "Halo!"
   - **User B harus melihat pesan LANGSUNG tanpa refresh!**
   - Cek console, harus ada log: `📨 New message received:`

### Test 2: Cek Console Logs

Di browser console, Anda harus melihat:
```
🔔 Subscribing to conversation.123
📨 New message received: {message: {...}}
```

Jika tidak ada log ini, berarti ada masalah dengan setup.

---

## 🐛 Troubleshooting

### Error: "Echo is not defined"
**Solusi:**
- Pastikan sudah jalankan `npm install`
- Restart Vite dev server: `npm run dev`
- Clear browser cache (Ctrl+Shift+Delete)

### Error: "Unable to connect to Pusher"
**Solusi:**
- Cek credentials di `.env` sudah benar
- Pastikan `VITE_PUSHER_APP_KEY` dan `VITE_PUSHER_APP_CLUSTER` ada di `.env`
- Restart Vite: `npm run dev`

### Error: "403 Forbidden" saat subscribe channel
**Solusi:**
- Cek `routes/channels.php` authorization sudah benar
- Pastikan token valid di localStorage
- Cek apakah user adalah participant conversation (buyer atau seller)

### Pesan tidak muncul real-time
**Solusi:**
1. Cek Laravel log: `storage/logs/laravel.log`
2. Cek Pusher dashboard untuk melihat events
3. Cek browser console untuk error
4. Pastikan `BROADCAST_DRIVER` di `.env` sudah benar
5. Untuk Reverb, pastikan server running: `php artisan reverb:start`

### Error: "CORS policy"
**Solusi:**
- Update `config/cors.php` seperti di Step 4
- Restart Laravel server

---

## 📊 Monitoring

### Pusher Dashboard
- Login ke [https://dashboard.pusher.com](https://dashboard.pusher.com)
- Pilih aplikasi Anda
- Buka tab "Debug Console"
- Kirim pesan dan lihat events real-time

### Laravel Log
```bash
tail -f storage/logs/laravel.log
```

### Browser Console
- Buka Developer Tools (F12)
- Tab Console
- Lihat log real-time saat kirim/terima pesan

---

## 🎯 Checklist Sebelum Production

- [ ] Setup Pusher/Reverb dengan credentials production
- [ ] Update `.env` production
- [ ] Test real-time functionality
- [ ] Setup queue worker: `php artisan queue:work`
- [ ] Monitor Pusher usage dan limits
- [ ] Setup error logging untuk broadcasting
- [ ] Consider using Redis untuk better performance
- [ ] Setup SSL/HTTPS untuk production

---

## 📝 Catatan Penting

1. **Pusher Free Tier Limits:**
   - 200,000 messages/day
   - 100 concurrent connections
   - Cukup untuk development dan small apps

2. **Laravel Reverb:**
   - Gratis, self-hosted
   - Perlu server yang always-on
   - Cocok untuk production dengan kontrol penuh

3. **Alternative: Polling**
   Jika tidak ingin setup broadcasting, bisa gunakan polling (fetch pesan setiap 3 detik). Tapi ini tidak efisien dan tidak real-time.

---

## 🆘 Butuh Bantuan?

Jika masih ada masalah:
1. Cek semua langkah sudah diikuti dengan benar
2. Cek Laravel log dan browser console untuk error
3. Pastikan semua service (Laravel, Vite, Reverb) berjalan
4. Test dengan 2 browser berbeda untuk memastikan real-time bekerja

---

**Selamat! Real-time chat Anda sekarang sudah siap! 🎉**
