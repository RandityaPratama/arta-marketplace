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

        // 2. Ambil detail produk berdasarkan ID yang ditemukan
        $products = DB::table('products')
            ->whereIn('id', $productIds)
            ->where('status', 'aktif')
            ->get();

        // 3. Gabungkan data produk dengan jumlah favoritnya
        $result = $products->map(function ($product) use ($popularMap) {
            $product->favoriteCount = $popularMap[$product->id] ?? 0;
            return $product;
        })->sortByDesc('favoriteCount')->values();

        return response()->json(['success' => true, 'data' => $result]);
    }
}