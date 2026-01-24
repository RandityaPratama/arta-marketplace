<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Favorites;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserFavoriteController extends Controller
{
    /**
     * Get list of favorited product IDs for the current user.
     */
    public function index()
    {
        if (!Auth::check()) {
            return response()->json([]);
        }

        $favorites = Favorites::where('user_id', Auth::id())
            ->pluck('product_id');

        return response()->json($favorites);
    }

    /**
     * Toggle favorite status (add if not exists, remove if exists).
     */
    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
        ]);

        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $userId = Auth::id();
        $productId = $request->product_id;

        $favorite = Favorites::where('user_id', $userId)
            ->where('product_id', $productId)
            ->first();

        if ($favorite) {
            $favorite->delete();
            return response()->json(['status' => 'removed', 'product_id' => $productId]);
        } else {
            Favorites::create([
                'user_id' => $userId,
                'product_id' => $productId,
            ]);

            // Create notification for the seller
            $product = \App\Models\Product::find($productId);
            if ($product && $product->user_id != $userId) { // Don't notify if user favorites their own product
                $user = Auth::user();
                \App\Services\NotificationService::createLikeNotification(
                    $product->user_id,
                    $user->name,
                    $product->name,
                    $productId
                );
            }

            return response()->json(['status' => 'added', 'product_id' => $productId]);
        }
    }

    /**
     * Get popular products based on favorite count.
     */
    public function popular()
    {
        // 1. Hitung jumlah favorit per produk dari tabel favorites
        $popular = DB::table('favorites')
            ->select('product_id', DB::raw('count(*) as total'))
            ->groupBy('product_id')
            ->orderByDesc('total')
            ->limit(12)
            ->get();

        if ($popular->isEmpty()) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $popularMap = $popular->pluck('total', 'product_id');
        $productIds = $popular->pluck('product_id');

        // Get current user ID if authenticated
        $currentUserId = Auth::check() ? Auth::id() : null;

        // 2. Ambil detail produk berdasarkan ID yang ditemukan dengan join ke users table
        $products = DB::table('products')
            ->leftJoin('users', 'products.user_id', '=', 'users.id')
            ->select(
                'products.*',
                'users.name as seller_name'
            )
            ->whereIn('products.id', $productIds)
            ->where('products.status', 'aktif')
            ->get();

        // 3. Gabungkan data produk dengan jumlah favoritnya dan tambahkan is_mine
        $result = $products->map(function ($product) use ($popularMap, $currentUserId) {
            $product->favoriteCount = $popularMap[$product->id] ?? 0;
            $product->seller_id = $product->user_id;
            // Cast to int for proper comparison since DB::table returns strings
            $product->is_mine = $currentUserId && (int)$product->user_id === (int)$currentUserId;
            return $product;
        })->sortByDesc('favoriteCount')->values();

        return response()->json(['success' => true, 'data' => $result]);
    }
}