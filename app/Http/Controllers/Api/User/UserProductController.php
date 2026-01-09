<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class UserProductController extends Controller
{
    /**
     * Menambahkan produk baru oleh user (Jual Barang)
     */
   public function addProduct(Request $request)
{
    // Log request masuk
    Log::info('Add product request received', [
        'user_id' => $request->user()?->id,
        'ip' => $request->ip(),
        'user_agent' => $request->userAgent(),
    ]);

    // 1. Validasi Input
    $validator = Validator::make($request->all(), [
        'name' => 'required|string|max:255',
        'category' => 'required|string',
        'price' => 'required|numeric',
        'original_price' => 'nullable|numeric',
        'discount' => 'nullable|integer',
        'location' => 'required|string',
        'condition' => 'required|string',
        'description' => 'required|string',
        'images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($validator->fails()) {

        Log::warning('Add product validation failed', [
            'user_id' => $request->user()?->id,
            'errors' => $validator->errors()->toArray(),
        ]);

        return response()->json([
            'success' => false,
            'errors' => $validator->errors()
        ], 422);
    }

    try {
        $imagePaths = [];

        // 2. Proses Upload Gambar
        if ($request->hasFile('images')) {

            Log::info('Processing product images', [
                'user_id' => $request->user()->id,
                'image_count' => count($request->file('images')),
            ]);

            foreach ($request->file('images') as $image) {
                $path = $image->store('products', 'public');
                $imagePaths[] = $path;

                Log::debug('Product image stored', [
                    'path' => $path,
                ]);
            }
        }

        // 3. Simpan Data Produk
        $product = Product::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'category' => $request->category,
            'price' => $request->price,
            'original_price' => $request->original_price,
            'discount' => $request->discount,
            'location' => $request->location,
            'condition' => $request->condition,
            'description' => $request->description,
            'images' => $imagePaths,
            'status' => 'menunggu',
        ]);

        // Catat aktivitas ke database
        try {
            Activity::create([
                'user_id' => $request->user()->id,
                'action' => $request->user()->name . ' mengunggah produk baru',
                'type' => 'produk',
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mencatat aktivitas upload produk', ['error' => $e->getMessage()]);
        }

        Log::info('Product successfully created', [
            'product_id' => $product->id,
            'user_id' => $request->user()->id,
            'image_count' => count($imagePaths),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Produk berhasil ditambahkan',
            'data' => $product
        ], 201);

    } catch (\Exception $e) {

        Log::error('Add product error', [
            'user_id' => $request->user()?->id,
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Gagal menambahkan produk',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Mengambil daftar produk (Marketplace Feed)
     * - Menampilkan produk aktif dari semua user
     * - Menampilkan semua produk (termasuk non-aktif) milik user yang sedang login
     * - Memberikan flag 'is_mine' untuk membedakan
     */
    public function getProducts(Request $request)
    {
        $user = $request->user();
        
        $query = Product::with('user');

        // ✅ MODE 1: Produk Saya (untuk halaman Profil)
        if ($request->has('mine') && $request->mine == 'true') {
            if (!$user) {
                return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
            }
            $query->where('user_id', $user->id);
        } 
        // ✅ MODE 2: Marketplace Feed (Produk orang lain + Produk saya)
        else if ($user) {
            $query->where(function($q) use ($user) {
                $q->where('status', 'aktif')
                  ->orWhere('user_id', $user->id);
            });
        } else {
            $query->where('status', 'aktif');
        }

        // Filter Pencarian
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter Kategori
        if ($request->has('category') && $request->category != '' && $request->category != 'Semua') {
            $query->where('category', $request->category);
        }

        // ✅ Pagination: Tampilkan lebih banyak (50) jika mode 'mine' agar profil lebih lengkap
        $perPage = ($request->has('mine') && $request->mine == 'true') ? 50 : 20;
        $products = $query->latest()->paginate($perPage);

        $formattedProducts = $products->getCollection()->map(function ($product) use ($user) {
            $isMine = $user ? $product->user_id === $user->id : false;
            
            // ✅ Pastikan images adalah array (handle jika database mengembalikan string JSON)
            $images = $product->images;
            if (is_string($images)) {
                $images = json_decode($images, true);
            }
            if (!is_array($images)) $images = [];

            return [
                'id' => $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => $product->price,
                'original_price' => $product->original_price,
                'discount' => $product->discount,
                'location' => $product->location,
                'condition' => $product->condition,
                'description' => $product->description,
                'images' => $images, 
                'status' => $product->status,
                'seller_name' => $product->user ? $product->user->name : 'Unknown',
                'seller_id' => $product->user_id,
                'is_mine' => $isMine,
                'published_at' => $product->created_at->format('d/m/Y'),
                'created_at_human' => $product->created_at->diffForHumans(),
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
     * Menghapus produk (Delete)
     */
    public function deleteProduct(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan'
            ], 404);
        }

        // Pastikan user adalah pemilik produk
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        try {
            $productName = $product->name;
            $product->delete();

            // Catat aktivitas
            try {
                Activity::create([
                    'user_id' => $request->user()->id,
                    'action' => $request->user()->name . ' menghapus produk ' . $productName,
                    'type' => 'produk',
                ]);
            } catch (\Exception $e) {
                Log::error('Gagal mencatat aktivitas hapus produk', ['error' => $e->getMessage()]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus'
            ]);

        } catch (\Exception $e) {
            Log::error('Delete product error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus produk'
            ], 500);
        }
    }

    /**
     * Memperbarui produk (Update)
     * Menangani edit info produk dan ubah status (Aktif/Terjual)
     */
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json([
                'success' => false,
                'message' => 'Produk tidak ditemukan'
            ], 404);
        }

        // Pastikan user adalah pemilik produk
        if ($product->user_id !== $request->user()->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized action.'
            ], 403);
        }

        // Validasi input (gunakan 'sometimes' agar tidak wajib mengirim semua field)
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric',
            'original_price' => 'nullable|numeric',
            'discount' => 'nullable|integer',
            'location' => 'sometimes|required|string',
            'condition' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
            'status' => 'sometimes|string|in:aktif,terjual,menunggu,ditolak',
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        try {
            $product->update($request->except(['images', 'user_id'])); // Images biasanya dihandle endpoint terpisah atau logic khusus

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil diperbarui',
                'data' => $product
            ]);

        } catch (\Exception $e) {
            Log::error('Update product error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui produk'
            ], 500);
        }
    }
}
