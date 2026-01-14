<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Report;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use Exception;

class AdminDashboardController extends Controller
{
    public function getStats()
    {
        try {
            // Total Pengguna (Current Month)
            $totalUsers = User::where('is_active', true)->count();
            $totalUsersLastMonth = User::where('is_active', true)
                ->where('created_at', '<', now()->startOfMonth())
                ->count();
            $usersChange = $this->calculatePercentageChange($totalUsersLastMonth, $totalUsers);

            // Produk Aktif (Current Month)
            $activeProducts = Product::where('status', 'aktif')->count();
            $activeProductsLastMonth = Product::where('status', 'aktif')
                ->where('created_at', '<', now()->startOfMonth())
                ->count();
            $activeProductsChange = $this->calculatePercentageChange($activeProductsLastMonth, $activeProducts);

            // Produk Terjual (Current Month)
            $soldProducts = Product::where('status', 'terjual')->count();
            $soldProductsLastMonth = Product::where('status', 'terjual')
                ->where('updated_at', '<', now()->startOfMonth())
                ->count();
            $soldProductsChange = $this->calculatePercentageChange($soldProductsLastMonth, $soldProducts);

            // Pengguna Aktif (This Week vs Last Week)
            $activeUsersWeek = DB::table('activities')
                ->where('created_at', '>=', now()->subWeek())
                ->distinct()
                ->count('user_id');
            
            $activeUsersLastWeek = DB::table('activities')
                ->whereBetween('created_at', [now()->subWeeks(2), now()->subWeek()])
                ->distinct()
                ->count('user_id');
            $activeUsersChange = $this->calculatePercentageChange($activeUsersLastWeek, $activeUsersWeek);

            // Aktivitas Terbaru
            $recentActivities = Activity::with(['user', 'admin'])
                ->latest()
                ->take(4)
                ->get()
                ->map(function ($activity) {
                    // Just return the action as-is from database
                    // The action already contains the full text (e.g., "ayam2 mengunggah produk baru")
                    return [
                        'id' => $activity->id,
                        'action' => $activity->action,
                        'time' => $activity->created_at->diffForHumans(),
                        'important' => $activity->type === 'produk'
                    ];
                });

            // Produk Terbaru
            $latestProducts = Product::with('user')
                ->where('status', 'aktif')
                ->latest()
                ->take(3)
                ->get()
                ->map(function ($product) {
                    return [
                        'name' => $product->name,
                        'seller' => $product->user ? $product->user->name : 'Unknown User',
                        'time' => $product->created_at->diffForHumans()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'stats' => [
                        'total_users' => $totalUsers,
                        'total_users_change' => $usersChange,
                        'active_products' => $activeProducts,
                        'active_products_change' => $activeProductsChange,
                        'sold_products' => $soldProducts,
                        'sold_products_change' => $soldProductsChange,
                        'active_users_week' => $activeUsersWeek,
                        'active_users_change' => $activeUsersChange
                    ],
                    'recent_activities' => $recentActivities,
                    'latest_products' => $latestProducts
                ]
            ]);
        } catch (Exception $e) {
            // Log the error
            Log::error('Dashboard Stats Error: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Calculate percentage change between two values
     * 
     * @param int $oldValue
     * @param int $newValue
     * @return array
     */
    private function calculatePercentageChange($oldValue, $newValue)
    {
        if ($oldValue == 0) {
            // If old value is 0, any new value is 100% increase (or 0% if new is also 0)
            $percentage = $newValue > 0 ? 100 : 0;
            $isIncrease = $newValue > 0;
        } else {
            $difference = $newValue - $oldValue;
            $percentage = round(($difference / $oldValue) * 100, 1);
            $isIncrease = $difference >= 0;
        }

        return [
            'percentage' => abs($percentage),
            'is_increase' => $isIncrease,
            'formatted' => ($isIncrease ? '+' : '-') . abs($percentage) . '%'
        ];
    }
}
