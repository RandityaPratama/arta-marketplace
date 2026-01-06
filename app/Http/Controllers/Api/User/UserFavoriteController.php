<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Favorites;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
            return response()->json(['status' => 'added', 'product_id' => $productId]);
        }
    }
}