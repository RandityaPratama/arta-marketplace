<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;


class UserController extends Controller
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

}