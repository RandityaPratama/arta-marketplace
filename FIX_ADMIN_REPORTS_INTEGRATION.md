# Fix: Admin Reports Page - Integrasi dengan Database

## 🐛 Masalah
Halaman Admin Reports tidak menampilkan laporan iklan karena masih menggunakan localStorage, belum terintegrasi dengan backend API yang baru dibuat.

## ✅ Solusi
Update `AdminReports.jsx` untuk fetch data dari database melalui API endpoint `/api/admin/reports`.

---

## 📝 Perubahan yang Dilakukan

### **File: resources/js/components/admin/AdminReports.jsx**

#### **1. Tambah State & Configuration:**
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
const STORAGE_URL = API_URL.replace(/\/api\/?$/, '') + '/product-images';

const [loading, setLoading] = useState(false);
const [statusFilter, setStatusFilter] = useState("all");
const [searchQuery, setSearchQuery] = useState("");

const getToken = () => localStorage.getItem('adminToken');
```

#### **2. Fetch Reports dari Database:**
```javascript
useEffect(() => {
  fetchAdReports();
}, [statusFilter, searchQuery]);

const fetchAdReports = async () => {
  const token = getToken();
  if (!token) return;

  setLoading(true);
  try {
    let url = `${API_URL}/admin/reports?`;
    if (statusFilter !== "all") {
      url += `status=${statusFilter}&`;
    }
    if (searchQuery) {
      url += `search=${encodeURIComponent(searchQuery)}&`;
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const result = await response.json();

    if (result.success) {
      const formattedReports = result.data.map(report => ({
        id: report.id,
        product: report.product.name,
        productId: report.product.id,
        reporter: report.reporter.name,
        reporterEmail: report.reporter.email,
        seller: report.seller.name,
        sellerId: report.seller.id,
        reportedDate: new Date(report.created_at).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        reason: report.reason,
        status: report.status === 'pending' ? 'Menunggu' :
                report.status === 'in_progress' ? 'Diproses' :
                report.status === 'resolved' ? 'Selesai' : 'Ditolak',
        statusRaw: report.status,
        productImage: report.product.images && report.product.images.length > 0
          ? `${STORAGE_URL}/${report.product.images[0]}`
          : "https://via.placeholder.com/60x60?text=Product",
        adminNotes: report.admin_notes,
        handledBy: report.handler?.name,
        handledAt: report.handled_at
      }));
      setAdReports(formattedReports);
    }
  } catch (error) {
    console.error("Error fetching reports:", error);
  } finally {
    setLoading(false);
  }
};
```

#### **3. Update Action Handlers:**

**Hapus Iklan (Delete Product):**
```javascript
const handleHideAd = async (reportId) => {
  if (!window.confirm("Hapus iklan ini secara permanen?")) return;

  const token = getToken();
  try {
    const response = await fetch(`${API_URL}/admin/reports/${reportId}/product`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    });
    const result = await response.json();

    if (result.success) {
      alert("Iklan telah dihapus!");
      fetchAdReports(); // Refresh data
    } else {
      alert(result.message || "Gagal menghapus iklan");
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    alert("Terjadi kesalahan saat menghapus iklan");
  }
};
```

**Update Status (Proses/Selesai):**
```javascript
const handleProcessAd = async (reportId) => {
  const token = getToken();
  try {
    const response = await fetch(`${API_URL}/admin/reports/${reportId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: 'in_progress',
        admin_notes: 'Laporan sedang ditinjau'
      })
    });
    const result = await response.json();

    if (result.success) {
      fetchAdReports(); // Refresh data
    } else {
      alert(result.message || "Gagal memproses laporan");
    }
  } catch (error) {
    console.error("Error updating status:", error);
    alert("Terjadi kesalahan saat memproses laporan");
  }
};
```

#### **4. Tambah Filter & Search UI:**
```javascript
{/* Filter & Search */}
<div className="flex flex-wrap gap-4 mb-6">
  <div className="flex-1 min-w-[200px]">
    <input
      type="text"
      placeholder="Cari produk, pelapor, atau penjual..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
    />
  </div>
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]"
  >
    <option value="all">Semua Status</option>
    <option value="pending">Menunggu</option>
    <option value="in_progress">Diproses</option>
    <option value="resolved">Selesai</option>
    <option value="rejected">Ditolak</option>
  </select>
</div>
```

#### **5. Tambah Loading & Empty State:**
```javascript
{loading ? (
  <div className="text-center py-12 text-gray-500">Memuat laporan...</div>
) : currentReports.length === 0 ? (
  <div className="text-center py-12 text-gray-500">
    {activeTab === "iklan" ? "Belum ada laporan iklan" : "Belum ada laporan pembelian"}
  </div>
) : (
  <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    {/* Table content */}
  </div>
)}
```

---

## 🎯 Fitur yang Ditambahkan

### **1. Real-time Data dari Database:**
- ✅ Fetch laporan dari API `/api/admin/reports`
- ✅ Data lengkap dengan relasi (reporter, product, seller, reason)
- ✅ Gambar produk dari storage

### **2. Filter & Search:**
- ✅ Filter by status (pending, in_progress, resolved, rejected)
- ✅ Search by product name, reporter name, seller name
- ✅ Auto-refresh saat filter/search berubah

### **3. Actions:**
- ✅ Hapus Iklan - DELETE `/api/admin/reports/{id}/product`
- ✅ Proses Laporan - PUT `/api/admin/reports/{id}/status` (status: in_progress)
- ✅ Selesai - PUT `/api/admin/reports/{id}/status` (status: resolved)
- ⚠️ Ban Akun - Placeholder (belum diimplementasi)

### **4. UI Improvements:**
- ✅ Loading state saat fetch data
- ✅ Empty state jika tidak ada laporan
- ✅ Error handling dengan alert
- ✅ Auto-refresh setelah action

---

## 🧪 Testing

### **1. Pastikan Ada Data Report:**
```bash
# Cek jumlah reports di database
php artisan tinker --execute="echo 'Reports: ' . App\Models\Report::count();"
```

### **2. Test Fetch Reports:**
```bash
# Login sebagai admin dulu untuk dapat token
curl -X POST http://127.0.0.1:8000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@gmail.com","password":"your_password"}'

# Kemudian fetch reports
curl -X GET http://127.0.0.1:8000/api/admin/reports \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Accept: application/json"
```

### **3. Test di Browser:**
1. Login sebagai admin
2. Buka `/admin/reports`
3. Verifikasi:
   - ✅ Laporan muncul dari database
   - ✅ Filter by status berfungsi
   - ✅ Search berfungsi
   - ✅ Tombol "Hapus Iklan" berfungsi
   - ✅ Tombol "Proses" berfungsi
   - ✅ Tombol "Selesai" berfungsi

---

## 🔍 Troubleshooting

### **"Laporan tidak muncul"**
**Kemungkinan Penyebab:**
1. Belum ada data reports di database
2. Token admin tidak valid
3. API endpoint error

**Solusi:**
```bash
# 1. Cek data reports
php artisan tinker --execute="echo App\Models\Report::count();"

# 2. Cek Laravel log
tail -f storage/logs/laravel.log

# 3. Cek console browser untuk error
# Buka DevTools → Console
```

### **"401 Unauthorized"**
**Penyebab:** Token admin tidak valid atau expired

**Solusi:**
1. Logout dan login ulang sebagai admin
2. Pastikan `localStorage.getItem('adminToken')` ada value-nya
3. Cek di DevTools → Application → Local Storage

### **"500 Internal Server Error"**
**Penyebab:** Error di backend (relasi, query, dll)

**Solusi:**
1. Cek Laravel log: `storage/logs/laravel.log`
2. Pastikan semua relasi di Model Report sudah benar
3. Pastikan ada data di tabel terkait (users, products, report_reasons)

### **"Gambar produk tidak muncul"**
**Penyebab:** Path gambar salah

**Solusi:**
1. Pastikan `STORAGE_URL` benar
2. Cek apakah file gambar ada di `public/product-images/`
3. Verifikasi path di database: `SELECT images FROM products;`

---

## 📊 Data Flow

```
Admin Login
  ↓
Get Admin Token
  ↓
AdminReports Page Load
  ↓
fetchAdReports()
  ↓
GET /api/admin/reports?status=...&search=...
  ↓
AdminReportController@index
  ↓
Query reports with relationships
  ↓
Format & return JSON
  ↓
Display in table
  ↓
User Action (Hapus/Proses/Selesai)
  ↓
API Call (DELETE/PUT)
  ↓
Update database
  ↓
fetchAdReports() (refresh)
  ↓
Display updated data
```

---

## ✅ Checklist

- [x] AdminReports.jsx updated
- [x] Fetch data dari API
- [x] Filter by status
- [x] Search functionality
- [x] Delete product action
- [x] Update status action
- [x] Loading states
- [x] Empty states
- [x] Error handling
- [x] Documentation

---

## 🎉 Result

Admin Reports page sekarang sudah:
- ✅ Terintegrasi dengan database
- ✅ Menampilkan data real-time
- ✅ Filter & search berfungsi
- ✅ Actions (hapus, proses, selesai) berfungsi
- ✅ UI responsive dengan loading & empty states

**Status: READY FOR TESTING**
