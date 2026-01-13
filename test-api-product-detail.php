<?php

/**
 * Script untuk test API endpoint /api/products/{id}
 * Jalankan dengan: php test-api-product-detail.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make('Illuminate\Contracts\Http\Kernel');

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;

echo "=== TEST API ENDPOINT /api/products/{id} ===\n\n";

// Ambil produk yang memiliki favorites
$product = Product::withCount('favorites')->has('favorites')->first();

if (!$product) {
    echo "❌ Tidak ada produk dengan favorites untuk di-test!\n";
    exit(1);
}

echo "Testing dengan Product ID: {$product->id}\n";
echo "Product Name: {$product->name}\n";
echo "Expected Favorites Count: {$product->favorites_count}\n\n";

// Simulasi request tanpa auth
echo "1. Test tanpa authentication:\n";
echo str_repeat("-", 80) . "\n";

$request = Request::create("/api/products/{$product->id}", 'GET');
$request->headers->set('Accept', 'application/json');

try {
    $response = $kernel->handle($request);
    $content = $response->getContent();
    $data = json_decode($content, true);
    
    echo "Status Code: {$response->getStatusCode()}\n";
    echo "Response:\n";
    echo json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
    
    if (isset($data['data']['favorites_count'])) {
        $favCount = $data['data']['favorites_count'];
        echo "✅ Favorites Count: {$favCount}\n";
        
        if ($favCount == $product->favorites_count) {
            echo "✅ BERHASIL! Favorites count sesuai dengan database.\n";
        } else {
            echo "❌ GAGAL! Favorites count tidak sesuai. Expected: {$product->favorites_count}, Got: {$favCount}\n";
        }
    } else {
        echo "❌ GAGAL! favorites_count tidak ada di response.\n";
    }
} catch (\Exception $e) {
    echo "❌ ERROR: {$e->getMessage()}\n";
}

echo "\n" . str_repeat("-", 80) . "\n\n";

// Simulasi request dengan auth
echo "2. Test dengan authentication:\n";
echo str_repeat("-", 80) . "\n";

$user = User::first();
if ($user) {
    $token = $user->createToken('test-token')->plainTextToken;
    
    $request = Request::create("/api/products/{$product->id}", 'GET');
    $request->headers->set('Accept', 'application/json');
    $request->headers->set('Authorization', "Bearer {$token}");
    
    try {
        $response = $kernel->handle($request);
        $content = $response->getContent();
        $data = json_decode($content, true);
        
        echo "Status Code: {$response->getStatusCode()}\n";
        echo "Response:\n";
        echo json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
        
        if (isset($data['data']['favorites_count'])) {
            $favCount = $data['data']['favorites_count'];
            echo "✅ Favorites Count: {$favCount}\n";
            
            if ($favCount == $product->favorites_count) {
                echo "✅ BERHASIL! Favorites count sesuai dengan database.\n";
            } else {
                echo "❌ GAGAL! Favorites count tidak sesuai. Expected: {$product->favorites_count}, Got: {$favCount}\n";
            }
        } else {
            echo "❌ GAGAL! favorites_count tidak ada di response.\n";
        }
        
        // Cleanup token
        $user->tokens()->delete();
    } catch (\Exception $e) {
        echo "❌ ERROR: {$e->getMessage()}\n";
    }
} else {
    echo "❌ Tidak ada user untuk test authentication.\n";
}

echo "\n=== TEST SELESAI ===\n";
