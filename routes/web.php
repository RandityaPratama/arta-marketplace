<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\UserPaymentController;

// ✅ FIX: Gunakan nama route custom '/product-images' untuk menghindari konflik folder 'storage'
// Ini memastikan gambar dilayani oleh Laravel, bukan diblokir oleh server
Route::get('/product-images/{path}', function ($path) {
    $filePath = storage_path('app/public/' . $path);

    // ✅ SECURITY: Mencegah directory traversal (akses file di luar folder)
    if (strpos($path, '..') !== false) {
        abort(404);
    }
    
    if (!file_exists($filePath)) {
        abort(404);
    }
    
    return response()->file($filePath);
})->where('path', '.*'); // Regex '.*' agar bisa membaca subfolder (contoh: products/foto.jpg)

// ✅ WORKAROUND: Handle Midtrans notification tanpa prefix /api
Route::post('/midtrans/notification', [UserPaymentController::class, 'notificationHandler']);

// ✅ UPDATE: Tambahkan pengecualian '|storage' agar URL gambar tidak dianggap halaman React
Route::get('/{any?}', function () {
    return view('welcome'); 
})->where('any', '^(?!api|product-images).*');