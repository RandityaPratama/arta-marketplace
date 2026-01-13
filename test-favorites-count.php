<?php

/**
 * Script untuk test favorites count di database
 * Jalankan dengan: php test-favorites-count.php
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;
use App\Models\Favorites;

echo "=== TEST FAVORITES COUNT ===\n\n";

// 1. Cek total favorites di database
$totalFavorites = Favorites::count();
echo "Total favorites di database: {$totalFavorites}\n\n";

// 2. Cek favorites per produk
echo "Favorites per produk:\n";
echo str_repeat("-", 80) . "\n";
printf("%-5s | %-30s | %-15s\n", "ID", "Nama Produk", "Jumlah Favorit");
echo str_repeat("-", 80) . "\n";

$products = Product::withCount('favorites')->get();

foreach ($products as $product) {
    printf("%-5s | %-30s | %-15s\n", 
        $product->id, 
        substr($product->name, 0, 30), 
        $product->favorites_count
    );
}

echo str_repeat("-", 80) . "\n\n";

// 3. Detail favorites untuk produk yang memiliki favorites
echo "Detail favorites (produk yang memiliki favorites):\n";
echo str_repeat("-", 80) . "\n";

$productsWithFavorites = Product::withCount('favorites')
    ->has('favorites')
    ->with(['favorites.user'])
    ->get();

if ($productsWithFavorites->isEmpty()) {
    echo "❌ TIDAK ADA PRODUK YANG MEMILIKI FAVORITES!\n";
    echo "Silakan tambahkan produk ke favorites terlebih dahulu dari aplikasi.\n\n";
} else {
    foreach ($productsWithFavorites as $product) {
        echo "\nProduk: {$product->name} (ID: {$product->id})\n";
        echo "Total favorites: {$product->favorites_count}\n";
        echo "Disukai oleh:\n";
        
        foreach ($product->favorites as $favorite) {
            echo "  - {$favorite->user->name} (User ID: {$favorite->user_id})\n";
        }
    }
}

echo "\n" . str_repeat("-", 80) . "\n";

// 4. Test query yang digunakan di controller
echo "\n=== TEST QUERY CONTROLLER ===\n\n";

$testProductId = $products->first()->id ?? null;

if ($testProductId) {
    echo "Testing dengan Product ID: {$testProductId}\n\n";
    
    $product = Product::with('user')->withCount('favorites')->find($testProductId);
    
    if ($product) {
        echo "Hasil query:\n";
        echo "  - Product Name: {$product->name}\n";
        echo "  - Favorites Count: {$product->favorites_count}\n";
        echo "  - Seller: {$product->user->name}\n";
        
        // Simulasi response API
        $response = [
            'id' => $product->id,
            'name' => $product->name,
            'favorites_count' => $product->favorites_count ?? 0,
            'seller_name' => $product->user ? $product->user->name : 'Unknown',
        ];
        
        echo "\nResponse API (simulasi):\n";
        echo json_encode($response, JSON_PRETTY_PRINT) . "\n";
    }
} else {
    echo "❌ Tidak ada produk di database!\n";
}

echo "\n=== TEST SELESAI ===\n";
