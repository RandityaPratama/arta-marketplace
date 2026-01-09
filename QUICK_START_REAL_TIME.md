# ⚡ Quick Start - Aktifkan Real-Time Chat

## 🎯 Tujuan
Mengaktifkan fitur real-time chat agar pesan muncul langsung tanpa refresh.

---

## 📝 Langkah Cepat (5 Menit)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Setup Pusher (Gratis)

**A. Daftar Pusher:**
- Buka: https://pusher.com
- Klik "Sign Up" (gratis)
- Buat aplikasi baru
- Pilih cluster: `ap1` (Asia Pacific)

**B. Copy Credentials:**
Dari Pusher Dashboard, copy:
- App ID
- Key  
- Secret
- Cluster

**C. Update `.env`:**
```env
BROADCAST_DRIVER=pusher

PUSHER_APP_ID=paste_app_id_disini
PUSHER_APP_KEY=paste_key_disini
PUSHER_APP_SECRET=paste_secret_disini
PUSHER_APP_CLUSTER=ap1

VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

### 3️⃣ Install Pusher PHP
```bash
composer require pusher/pusher-php-server
```

### 4️⃣ Restart Services
```bash
# Stop semua (Ctrl+C di terminal)

# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite
npm run dev
```

### 5️⃣ Test!
1. Buka 2 browser (Chrome + Firefox)
2. Login sebagai 2 user berbeda
3. Kirim pesan dari User A
4. **User B harus lihat pesan LANGSUNG!** ✨

---

## ✅ Checklist

- [ ] `npm install` sudah dijalankan
- [ ] Pusher account sudah dibuat
- [ ] Credentials sudah di-copy ke `.env`
- [ ] `composer require pusher/pusher-php-server` sudah dijalankan
- [ ] Laravel server running (`php artisan serve`)
- [ ] Vite dev server running (`npm run dev`)
- [ ] Test dengan 2 browser - pesan muncul real-time!

---

## 🐛 Troubleshooting Cepat

### Pesan masih tidak real-time?

**1. Cek Console Browser (F12):**
Harus ada log:
```
🔔 Subscribing to conversation.123
📨 New message received: {...}
```

Jika tidak ada → Restart Vite: `npm run dev`

**2. Cek `.env`:**
Pastikan ada:
```env
VITE_PUSHER_APP_KEY="${PUSHER_APP_KEY}"
VITE_PUSHER_APP_CLUSTER="${PUSHER_APP_CLUSTER}"
```

**3. Clear Cache:**
- Browser: Ctrl+Shift+Delete
- Laravel: `php artisan config:clear`

**4. Cek Pusher Dashboard:**
- Login ke https://dashboard.pusher.com
- Pilih app Anda
- Tab "Debug Console"
- Kirim pesan → harus muncul event di sini

---

## 🎉 Selesai!

Jika semua langkah diikuti, chat Anda sekarang **REAL-TIME**!

Pesan akan muncul langsung tanpa refresh. 🚀

---

**Butuh panduan lengkap?** Baca: `REAL_TIME_CHAT_SETUP_GUIDE.md`
