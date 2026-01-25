<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AdminProductController extends Controller
{
    /**
     * Mengambil daftar produk untuk admin dengan filter dan pagination
     */
    public function getAllProducts(Request $request)
    {
        // Eager load 'user' untuk mendapatkan nama penjual
        $query = Product::with('user');

        // 1. Filter Status
        if ($request->has('status') && $request->status !== 'semua') {
            $query->where('status', $request->status);
        }

        // 2. Pencarian (Nama Produk)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%");
        }

        // 3. Sorting & Pagination
        $products = $query->latest()->paginate(10);

        // Transformasi data agar sesuai dengan tampilan AdminProducts.jsx
        $formattedProducts = $products->getCollection()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'seller' => $product->user ? $product->user->name : 'Unknown User',
                'category' => $product->category,
                'price' => number_format($product->price, 0, ',', '.'),
                'location' => $product->location,
                'uploadedAt' => $product->created_at->diffForHumans(), // Contoh: "2 jam lalu"
                'status' => $product->status,
                'images' => $product->images, // Array path gambar
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedProducts,
            'pagination' => [
                'total' => $products->total(),
                'per_page' => $products->perPage(),
                'current_page' => $products->currentPage(),
                'last_page' => $products->lastPage(),
            ]
        ]);
    }

    /**
     * Mengubah status produk (Approve, Reject, Hide)
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:aktif,ditolak,menunggu,terjual,disembunyikan',
            'reason' => 'nullable|string|required_if:status,ditolak',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        $product = Product::find($id);

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Produk tidak ditemukan'], 404);
        }

        $product->status = $request->status;
        // Simpan alasan penolakan jika status ditolak
        if ($request->status === 'ditolak' && $request->has('reason')) {
            $product->rejection_reason = $request->reason;
        } else if ($request->status !== 'ditolak') {
            // Hapus rejection_reason jika status berubah dari ditolak ke status lain
            $product->rejection_reason = null;
        }
        $product->save();

        Log::info("Admin updated product status", ['product_id' => $id, 'status' => $request->status]);

        // Catat aktivitas admin ke database
        try {
            $adminName = $request->user()->name;
            $actionText = "Admin {$adminName} mengubah status produk {$product->name} menjadi {$request->status}";

            if ($request->status === 'aktif') {
                $actionText = "Admin {$adminName} menyetujui produk {$product->name}";
            } elseif ($request->status === 'ditolak') {
                $actionText = "Admin {$adminName} menolak produk {$product->name}";
            }

            Activity::create([
                'user_id' => null, // Null karena admin berada di tabel terpisah
                'admin_id' => $request->user()->id,
                'action' => $actionText,
                'type' => 'admin',
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mencatat aktivitas admin', ['error' => $e->getMessage()]);
        }

        return response()->json(['success' => true, 'message' => 'Status produk berhasil diperbarui']);
    }
}