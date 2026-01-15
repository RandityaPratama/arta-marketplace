# 📋 Manual Testing Guide - Admin Profile & User Avatar Features

## 🎯 Testing Overview

Dokumen ini berisi panduan lengkap untuk melakukan manual testing terhadap fitur-fitur yang telah diimplementasikan:

1. **Admin Profile Management** (View, Edit, Avatar Upload, Change Password)
2. **Admin User Profile Viewing** (dengan Purchases Integration)
3. **User Avatar Upload** (di halaman Profile user)

---

## 🔧 Prerequisites

### 1. Ensure Services are Running
```bash
# Terminal 1: Laravel Backend
php artisan serve --port=8000

# Terminal 2: Vite Frontend
npm run dev
```

### 2. Database Setup
```bash
# Run migrations (if not done)
php artisan migrate

# Create admin account (if needed)
php artisan admin:manage create
```

### 3. Test Data Requirements
- ✅ At least 1 admin account
- ✅ At least 2 regular user accounts
- ✅ At least 1 transaction record (for purchases testing)
- ✅ Test images for avatar upload (< 2MB, JPG/PNG format)

---

## 🧪 Test Cases

### SECTION 1: Admin Profile Management

#### Test 1.1: View Admin Profile
**Steps:**
1. Open browser: `http://localhost:5173/admin`
2. Login dengan kredensial admin
3. Click avatar di pojok kanan atas navbar
4. Verify redirect ke `/admin/profile`

**Expected Results:**
- ✅ Halaman profile admin tampil
- ✅ Menampilkan: Name, Email, Phone (jika ada), Last Login
- ✅ Avatar tampil (atau initial jika belum ada avatar)
- ✅ Tombol "Edit Profil", "Ubah Password", "Kembali" tersedia

**Status:** [ ] PASS [ ] FAIL

---

#### Test 1.2: Edit Admin Profile
**Steps:**
1. Di halaman admin profile, click "Edit Profil"
2. Modal edit muncul
3. Ubah nama: "Test Admin Updated"
4. Ubah phone: "081234567890"
5. Click "Simpan"

**Expected Results:**
- ✅ Modal edit muncul dengan data saat ini
- ✅ Form validation bekerja (nama required)
- ✅ Setelah save, notification success muncul
- ✅ Data terupdate di halaman
- ✅ Modal tertutup otomatis

**Status:** [ ] PASS [ ] FAIL

---

#### Test 1.3: Upload Admin Avatar
**Steps:**
1. Di halaman admin profile
2. Hover mouse pada avatar
3. Tombol "Ubah Foto" muncul
4. Click tombol tersebut
5. Pilih gambar (< 2MB, format JPG/PNG)
6. Wait for upload

**Expected Results:**
- ✅ Hover effect bekerja (tombol muncul)
- ✅ File picker terbuka
- ✅ Upload berhasil, notification success
- ✅ Avatar langsung terupdate
- ✅ Refresh page, avatar persist
- ✅ Avatar lama terhapus dari storage

**Status:** [ ] PASS [ ] FAIL

---

#### Test 1.4: Avatar Upload Validation
**Steps:**
1. Test upload file > 2MB
2. Test upload file non-image (PDF, TXT, etc)

**Expected Results:**
- ✅ File > 2MB: Error "Ukuran file maksimal 2MB"
- ✅ File non-image: Error "File harus berupa gambar"
- ✅ Avatar tidak terupload
- ✅ Notification error muncul

**Status:** [ ] PASS [ ] FAIL

---

#### Test 1.5: Change Admin Password
**Steps:**
1. Di halaman admin profile, click "Ubah Password"
2. Modal change password muncul
3. Isi:
   - Current Password: [password lama]
   - New Password: "newpassword123"
   - Confirm Password: "newpassword123"
4. Click "Ubah Password"

**Expected Results:**
- ✅ Modal muncul dengan 3 input fields
- ✅ Validation bekerja (min 8 chars, passwords match)
- ✅ Setelah save, notification success
- ✅ Auto logout dan redirect ke login
- ✅ Login dengan password baru berhasil
- ✅ Login dengan password lama gagal

**Status:** [ ] PASS [ ] FAIL

---

### SECTION 2: Admin User Profile Viewing

#### Test 2.1: Navigate to User Profile
**Steps:**
1. Login sebagai admin
2. Pergi ke menu "Pengguna" (`/admin/users`)
3. Click nama salah satu user
4. Verify redirect ke `/admin/user/{userId}`

**Expected Results:**
- ✅ Halaman user profile tampil
- ✅ Menampilkan user info: Name, Email, Phone, Location, Status, Join Date
- ✅ Avatar user tampil (atau initial)
- ✅ Tab navigation tersedia: "Iklan" dan "Pembelian"
- ✅ Tombol "Kembali" dan "Blokir/Aktifkan" tersedia

**Status:** [ ] PASS [ ] FAIL

---

#### Test 2.2: View User Listings (Iklan Tab)
**Steps:**
1. Di halaman user profile
2. Pastikan tab "Iklan" aktif (default)
3. Scroll untuk melihat daftar produk

**Expected Results:**
- ✅ Tab "Iklan" aktif by default
- ✅ Menampilkan semua produk yang dijual user
- ✅ Setiap produk menampilkan: Image, Name, Category, Price, Status
- ✅ Status badge dengan warna sesuai (Aktif=hijau, Menunggu=kuning, Ditolak=merah)
- ✅ Jika tidak ada produk: "Pengguna ini belum menjual produk"

**Status:** [ ] PASS [ ] FAIL

---

#### Test 2.3: View User Purchases (Pembelian Tab) ⭐ NEW
**Steps:**
1. Di halaman user profile
2. Click tab "Pembelian"
3. Verify data purchases tampil

**Expected Results:**
- ✅ Tab "Pembelian" bisa diklik
- ✅ Menampilkan daftar transaksi pembelian user
- ✅ Setiap purchase menampilkan:
  - Product Name
  - Seller Name
  - Price (formatted)
  - Purchase Date
  - Status (Pending/Completed/etc)
- ✅ Data diambil dari tabel `transactions`
- ✅ Jika tidak ada purchases: "Pengguna ini belum membeli produk"

**Status:** [ ] PASS [ ] FAIL

---

#### Test 2.4: Block/Unblock User
**Steps:**
1. Di halaman user profile (user dengan status Aktif)
2. Click tombol "Blokir"
3. Confirm dialog
4. Verify status berubah
5. Click tombol "Aktifkan" untuk unblock

**Expected Results:**
- ✅ Tombol "Blokir" tersedia untuk user aktif
- ✅ Confirmation dialog muncul
- ✅ Setelah confirm, status berubah ke "Diblokir"
- ✅ Tombol berubah jadi "Aktifkan"
- ✅ Notification success muncul
- ✅ Activity log tercatat
- ✅ User tidak bisa login saat diblokir

**Status:** [ ] PASS [ ] FAIL

---

### SECTION 3: User Avatar Upload (Regular User)

#### Test 3.1: View User Profile
**Steps:**
1. Logout dari admin
2. Login sebagai regular user
3. Click menu "Profile" atau avatar di navbar
4. Verify redirect ke `/profile`

**Expected Results:**
- ✅ Halaman profile user tampil
- ✅ Menampilkan: Name, Email, Phone, Location, Join Date
- ✅ Avatar tampil (atau icon User jika belum ada)
- ✅ Statistik: Produk Aktif, Produk Terjual
- ✅ Tab: Produk Aktif, Terjual, Menunggu Persetujuan
- ✅ Tombol "Edit Profil" dan "Jual Barang"

**Status:** [ ] PASS [ ] FAIL

---

#### Test 3.2: Upload User Avatar ⭐ NEW
**Steps:**
1. Di halaman profile user
2. Hover mouse pada avatar (icon User)
3. Tombol "Ubah" muncul dengan overlay hitam transparan
4. Click area avatar
5. Pilih gambar (< 2MB, JPG/PNG)
6. Wait for upload

**Expected Results:**
- ✅ Hover effect bekerja (overlay + text "Ubah" muncul)
- ✅ File picker terbuka saat click
- ✅ Upload berhasil, notification "Avatar berhasil diperbarui"
- ✅ Avatar langsung terupdate di halaman
- ✅ Refresh page, avatar persist
- ✅ Avatar juga terupdate di navbar
- ✅ Activity log tercatat: "{name} mengubah foto profil"

**Status:** [ ] PASS [ ] FAIL

---

#### Test 3.3: User Avatar Validation
**Steps:**
1. Test upload file > 2MB
2. Test upload file non-image

**Expected Results:**
- ✅ File > 2MB: Error "Ukuran file maksimal 2MB"
- ✅ File non-image: Error "File harus berupa gambar"
- ✅ Avatar tidak terupdate
- ✅ Notification error muncul (merah)

**Status:** [ ] PASS [ ] FAIL

---

#### Test 3.4: Replace Existing Avatar
**Steps:**
1. User sudah punya avatar
2. Upload avatar baru
3. Verify avatar lama terhapus

**Expected Results:**
- ✅ Upload avatar baru berhasil
- ✅ Avatar lama terhapus dari `storage/app/public/avatars/users/`
- ✅ Hanya 1 avatar file per user di storage
- ✅ Avatar baru tampil di semua tempat (profile, navbar, dll)

**Status:** [ ] PASS [ ] FAIL

---

#### Test 3.5: Edit User Profile (Non-Avatar)
**Steps:**
1. Di halaman profile, click "Edit Profil"
2. Modal edit muncul
3. Ubah:
   - Name: "Updated User Name"
   - Phone: "081234567890"
   - Location: "Jakarta"
4. Click "Simpan"

**Expected Results:**
- ✅ Modal edit muncul dengan data saat ini
- ✅ Form validation bekerja
- ✅ Setelah save, notification success
- ✅ Data terupdate di halaman
- ✅ Modal tertutup
- ✅ Avatar tidak berubah (tetap sama)

**Status:** [ ] PASS [ ] FAIL

---

## 🔍 Integration Testing

### Test INT-1: Admin Views User with Avatar
**Steps:**
1. Login sebagai user, upload avatar
2. Logout, login sebagai admin
3. Pergi ke Users management
4. Click user yang tadi upload avatar
5. Verify avatar tampil di admin user profile

**Expected Results:**
- ✅ Avatar user tampil di admin user profile page
- ✅ Avatar URL correct: `http://127.0.0.1:8000/storage/avatars/users/{filename}`

**Status:** [ ] PASS [ ] FAIL

---

### Test INT-2: Purchases Data Integration
**Steps:**
1. Pastikan ada transaksi di database (user sudah beli produk)
2. Login sebagai admin
3. View user profile yang punya transaksi
4. Click tab "Pembelian"
5. Verify data purchases tampil dengan benar

**Expected Results:**
- ✅ Purchases data tidak kosong
- ✅ Product name sesuai dengan transaksi
- ✅ Seller name sesuai (pemilik produk)
- ✅ Price formatted dengan benar (Rp. X.XXX)
- ✅ Purchase date formatted (dd MMM yyyy)
- ✅ Status sesuai dengan transaction status

**Status:** [ ] PASS [ ] FAIL

---

### Test INT-3: Avatar Persistence Across Sessions
**Steps:**
1. Login, upload avatar
2. Logout
3. Login lagi
4. Verify avatar masih tampil

**Expected Results:**
- ✅ Avatar persist setelah logout/login
- ✅ Avatar tampil di semua pages (navbar, profile, dll)
- ✅ Avatar URL tidak berubah

**Status:** [ ] PASS [ ] FAIL

---

## 🐛 Edge Cases & Error Handling

### Test EDGE-1: Network Error During Upload
**Steps:**
1. Disconnect internet (atau simulate slow network)
2. Try upload avatar
3. Observe behavior

**Expected Results:**
- ✅ Loading indicator tampil
- ✅ Setelah timeout, error notification muncul
- ✅ "Terjadi kesalahan jaringan"
- ✅ Avatar tidak berubah

**Status:** [ ] PASS [ ] FAIL

---

### Test EDGE-2: Concurrent Avatar Uploads
**Steps:**
1. Open 2 browser tabs dengan same user
2. Upload different avatars di kedua tabs
3. Observe behavior

**Expected Results:**
- ✅ Last upload wins
- ✅ Both tabs eventually show same avatar after refresh
- ✅ Only 1 avatar file in storage

**Status:** [ ] PASS [ ] FAIL

---

### Test EDGE-3: View Deleted User Profile
**Steps:**
1. Soft delete a user from database
2. Try access `/admin/user/{deletedUserId}`

**Expected Results:**
- ✅ 404 error atau "User not found"
- ✅ Graceful error handling

**Status:** [ ] PASS [ ] FAIL

---

## 📊 Performance Testing

### Test PERF-1: Large Avatar Upload
**Steps:**
1. Upload avatar close to 2MB limit (e.g., 1.9MB)
2. Measure upload time

**Expected Results:**
- ✅ Upload completes within reasonable time (< 10s)
- ✅ No timeout errors
- ✅ Image displays correctly

**Status:** [ ] PASS [ ] FAIL

---

### Test PERF-2: Multiple Users with Avatars
**Steps:**
1. Create 10+ users with avatars
2. Admin views users list
3. Admin views each user profile

**Expected Results:**
- ✅ Users list loads quickly
- ✅ Avatars load without lag
- ✅ No N+1 query issues
- ✅ User profile pages load quickly

**Status:** [ ] PASS [ ] FAIL

---

## 🔒 Security Testing

### Test SEC-1: Unauthorized Avatar Access
**Steps:**
1. Logout (no authentication)
2. Try POST to `/api/profile/avatar`

**Expected Results:**
- ✅ 401 Unauthorized error
- ✅ Avatar not uploaded

**Status:** [ ] PASS [ ] FAIL

---

### Test SEC-2: Admin Cannot Upload to User Endpoint
**Steps:**
1. Login as admin
2. Try POST to `/api/profile/avatar` (user endpoint)

**Expected Results:**
- ✅ 403 Forbidden or appropriate error
- ✅ Admin should use `/api/admin/profile/avatar`

**Status:** [ ] PASS [ ] FAIL

---

### Test SEC-3: File Type Bypass Attempt
**Steps:**
1. Rename malicious file (e.g., script.php) to script.jpg
2. Try upload as avatar

**Expected Results:**
- ✅ Upload rejected
- ✅ Server validates actual file type, not just extension
- ✅ Error notification shown

**Status:** [ ] PASS [ ] FAIL

---

## 📝 Test Summary Template

```
=== TESTING SESSION ===
Date: _______________
Tester: _______________
Environment: Development / Staging / Production

SECTION 1: Admin Profile Management
- Test 1.1: [ ] PASS [ ] FAIL
- Test 1.2: [ ] PASS [ ] FAIL
- Test 1.3: [ ] PASS [ ] FAIL
- Test 1.4: [ ] PASS [ ] FAIL
- Test 1.5: [ ] PASS [ ] FAIL

SECTION 2: Admin User Profile Viewing
- Test 2.1: [ ] PASS [ ] FAIL
- Test 2.2: [ ] PASS [ ] FAIL
- Test 2.3: [ ] PASS [ ] FAIL ⭐ NEW
- Test 2.4: [ ] PASS [ ] FAIL

SECTION 3: User Avatar Upload
- Test 3.1: [ ] PASS [ ] FAIL
- Test 3.2: [ ] PASS [ ] FAIL ⭐ NEW
- Test 3.3: [ ] PASS [ ] FAIL ⭐ NEW
- Test 3.4: [ ] PASS [ ] FAIL ⭐ NEW
- Test 3.5: [ ] PASS [ ] FAIL

Integration Tests: ___/3 PASS
Edge Cases: ___/3 PASS
Performance: ___/2 PASS
Security: ___/3 PASS

TOTAL: ___/23 PASS

Issues Found:
1. _______________
2. _______________
3. _______________

Notes:
_______________
_______________
```

---

## 🚀 Quick Test Checklist

**Critical Path (Must Test):**
- [ ] Admin can view own profile
- [ ] Admin can upload avatar
- [ ] Admin can view user profile
- [ ] Purchases tab shows data (not empty) ⭐
- [ ] User can upload avatar ⭐
- [ ] Avatar persists after refresh

**Nice to Have:**
- [ ] All validation works
- [ ] All error handling works
- [ ] Performance is acceptable
- [ ] Security measures in place

---

## 📞 Support

Jika menemukan bug atau issue:
1. Screenshot error message
2. Note steps to reproduce
3. Check browser console for errors (F12)
4. Check Laravel logs: `storage/logs/laravel.log`
5. Report dengan detail lengkap

---

**Document Version:** 1.0  
**Last Updated:** January 12, 2026  
**Status:** Ready for Testing ✅
