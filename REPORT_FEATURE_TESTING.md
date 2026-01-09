# Testing Report Feature - Laporan Iklan

## ✅ Migration Status
- [x] Tabel `reports` berhasil dibuat
- [x] Relasi ke users, products, report_reasons, admins sudah terkonfigurasi

---

## 🧪 API Testing Guide

### Prerequisites
1. Server Laravel harus running: `php artisan serve`
2. Pastikan ada data:
   - Users (untuk login)
   - Products (untuk dilaporkan)
   - Report Reasons (tambah via Admin Settings)
3. Dapatkan token dengan login terlebih dahulu

---

## 📝 Test Scenarios

### **1. USER ENDPOINTS**

#### **A. Get Report Reasons**
```bash
# Test: Fetch report reasons dari database
curl -X GET http://127.0.0.1:8000/api/report-reasons \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Accept: application/json"

# Expected Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "reason": "Harga tidak sesuai pasar"
    },
    {
      "id": 2,
      "reason": "Menjual barang palsu"
    }
  ]
}
```

#### **B. Submit Report (Happy Path)**
```bash
# Test: Submit laporan iklan
curl -X POST http://127.0.0.1:8000/api/reports \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "product_id": 1,
    "report_reason_id": 1
  }'

# Expected Response:
{
  "success": true,
  "message": "Laporan berhasil dikirim",
  "data": {
    "id": 1,
    "reporter_id": 1,
    "product_id": 1,
    "seller_id": 2,
    "report_reason_id": 1,
    "status": "pending",
    "created_at": "2026-01-09 20:00:00"
  }
}
```

#### **C. Submit Report (Error: Duplicate)**
```bash
# Test: Submit laporan yang sama 2x
curl -X POST http://127.0.0.1:8000/api/reports \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "product_id": 1,
    "report_reason_id": 1
  }'

# Expected Response:
{
  "success": false,
  "message": "Anda sudah melaporkan produk ini sebelumnya"
}
```

#### **D. Submit Report (Error: Invalid Data)**
```bash
# Test: Product ID tidak ada
curl -X POST http://127.0.0.1:8000/api/reports \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "product_id": 99999,
    "report_reason_id": 1
  }'

# Expected Response:
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "product_id": ["The selected product id is invalid."]
  }
}
```

#### **E. Get My Reports**
```bash
# Test: Lihat laporan user sendiri
curl -X GET http://127.0.0.1:8000/api/my-reports \
  -H "Authorization: Bearer YOUR_USER_TOKEN" \
  -H "Accept: application/json"

# Expected Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "name": "Samsung S24 Ultra",
        "price": "15000000"
      },
      "seller": {
        "id": 2,
        "name": "Seller Name"
      },
      "reportReason": {
        "id": 1,
        "reason": "Harga tidak sesuai pasar"
      },
      "status": "pending",
      "created_at": "2026-01-09 20:00:00"
    }
  ]
}
```

---

### **2. ADMIN ENDPOINTS**

#### **A. Get All Reports**
```bash
# Test: List semua laporan
curl -X GET http://127.0.0.1:8000/api/admin/reports \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# Expected Response:
{
  "success": true,
  "data": [
    {
      "id": 1,
      "reporter": {
        "id": 1,
        "name": "User Name",
        "email": "user@example.com"
      },
      "product": {
        "id": 1,
        "name": "Samsung S24 Ultra",
        "price": "15000000",
        "images": [...]
      },
      "seller": {
        "id": 2,
        "name": "Seller Name",
        "email": "seller@example.com"
      },
      "reason": "Harga tidak sesuai pasar",
      "status": "pending",
      "admin_notes": null,
      "handler": null,
      "created_at": "2026-01-09 20:00:00",
      "handled_at": null
    }
  ]
}
```

#### **B. Get Reports with Filter**
```bash
# Test: Filter by status
curl -X GET "http://127.0.0.1:8000/api/admin/reports?status=pending" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# Test: Search
curl -X GET "http://127.0.0.1:8000/api/admin/reports?search=Samsung" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

#### **C. Get Report Detail**
```bash
# Test: Detail laporan
curl -X GET http://127.0.0.1:8000/api/admin/reports/1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# Expected Response: Similar to list but with more details
```

#### **D. Update Report Status**
```bash
# Test: Update status ke "in_progress"
curl -X PUT http://127.0.0.1:8000/api/admin/reports/1/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "status": "in_progress",
    "admin_notes": "Sedang ditinjau oleh tim"
  }'

# Expected Response:
{
  "success": true,
  "message": "Status laporan berhasil diupdate",
  "data": {
    "id": 1,
    "status": "in_progress",
    "admin_notes": "Sedang ditinjau oleh tim",
    "handled_by": 1,
    "handled_at": "2026-01-09 20:30:00"
  }
}
```

#### **E. Update Status (Error: Invalid Status)**
```bash
# Test: Status tidak valid
curl -X PUT http://127.0.0.1:8000/api/admin/reports/1/status \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "status": "invalid_status"
  }'

# Expected Response:
{
  "success": false,
  "message": "Validasi gagal",
  "errors": {
    "status": ["The selected status is invalid."]
  }
}
```

#### **F. Delete Reported Product**
```bash
# Test: Hapus produk yang dilaporkan
curl -X DELETE http://127.0.0.1:8000/api/admin/reports/1/product \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"

# Expected Response:
{
  "success": true,
  "message": "Produk berhasil dihapus"
}

# Note: Report status otomatis berubah jadi "resolved"
```

---

## 🎨 FRONTEND TESTING

### **1. Product Detail Page**

**Test Flow:**
1. Login sebagai user
2. Buka product detail page (misal: `/product/1`)
3. Klik tombol "Laporkan"
4. Modal report terbuka
5. Pilih alasan laporan (data dari database)
6. Klik "Kirim Laporan"
7. Notifikasi sukses muncul
8. Modal tertutup

**Expected Behavior:**
- ✅ Report reasons ter-fetch dari API
- ✅ Loading state saat fetch
- ✅ Validasi: harus pilih alasan
- ✅ Submit berhasil
- ✅ Notifikasi sukses/error muncul
- ✅ Tidak bisa report produk yang sama 2x

---

### **2. Admin Reports Page**

**Test Flow:**
1. Login sebagai admin
2. Buka `/admin/reports`
3. List reports tampil
4. Test filter by status
5. Test search
6. Klik detail report
7. Update status
8. Delete product (jika perlu)

**Expected Behavior:**
- ✅ List reports tampil dengan data lengkap
- ✅ Filter berfungsi
- ✅ Search berfungsi
- ✅ Update status berhasil
- ✅ Delete product berhasil

---

## 🔍 EDGE CASES TO TEST

1. **Unauthorized Access:**
   - User tanpa token tidak bisa akses endpoint
   - User biasa tidak bisa akses admin endpoint

2. **Invalid Data:**
   - Product ID tidak ada
   - Report Reason ID tidak ada
   - Status tidak valid

3. **Duplicate Report:**
   - User tidak bisa report produk yang sama 2x (kecuali sudah resolved)

4. **Database Integrity:**
   - Relasi antar tabel berfungsi
   - Cascade delete berfungsi (jika user/product dihapus)

5. **Performance:**
   - Query dengan relasi tidak lambat
   - Pagination (jika ada banyak reports)

---

## ✅ CHECKLIST TESTING

### Backend API:
- [ ] GET /api/report-reasons - Success
- [ ] POST /api/reports - Success (happy path)
- [ ] POST /api/reports - Error (duplicate)
- [ ] POST /api/reports - Error (invalid data)
- [ ] GET /api/my-reports - Success
- [ ] GET /api/admin/reports - Success
- [ ] GET /api/admin/reports?status=pending - Success
- [ ] GET /api/admin/reports?search=keyword - Success
- [ ] GET /api/admin/reports/{id} - Success
- [ ] PUT /api/admin/reports/{id}/status - Success
- [ ] PUT /api/admin/reports/{id}/status - Error (invalid status)
- [ ] DELETE /api/admin/reports/{id}/product - Success

### Frontend:
- [ ] ProductDetailPage - Modal opens
- [ ] ProductDetailPage - Report reasons loaded
- [ ] ProductDetailPage - Submit report success
- [ ] ProductDetailPage - Validation works
- [ ] ProductDetailPage - Error handling
- [ ] Admin Reports - List displays
- [ ] Admin Reports - Filter works
- [ ] Admin Reports - Search works
- [ ] Admin Reports - Update status works
- [ ] Admin Reports - Delete product works

### Database:
- [ ] Tabel reports created
- [ ] Data tersimpan dengan benar
- [ ] Relasi berfungsi
- [ ] Indexes berfungsi

---

## 🚀 NEXT STEPS AFTER TESTING

1. Fix any bugs found during testing
2. Add pagination for reports list (if needed)
3. Add email notification when report status changes
4. Add report statistics in admin dashboard
5. Consider adding report history/audit log

---

## 📌 NOTES

- Pastikan ada data report_reasons di database sebelum testing
- Gunakan Postman atau Insomnia untuk test API lebih mudah
- Check Laravel log jika ada error: `storage/logs/laravel.log`
- Untuk production, tambahkan rate limiting pada report endpoint
