<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AdminUserController extends Controller
{
    /**
     * Mengambil daftar pengguna dengan pencarian dan pagination
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Filter Pencarian (Nama atau Email)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Pagination 10 item per halaman
        $users = $query->latest()->paginate(10);

        // Format data agar sesuai dengan AdminUsers.jsx
        $formattedUsers = $users->getCollection()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                // Asumsi: kolom is_active (boolean). Jika tidak ada, sesuaikan logikanya.
                'status' => $user->is_active ? 'Aktif' : 'Diblokir', 
                'joined' => $user->created_at->format('d M Y'),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedUsers,
            'pagination' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ]
        ]);
    }

    /**
     * Mengambil detail pengguna untuk AdminUserProfile.jsx
     */
    public function show($id)
    {
        try {
            $user = User::with(['products', 'purchases.product.user'])->find($id);

            if (!$user) {
                return response()->json([
                    'success' => false, 
                    'message' => 'Pengguna tidak ditemukan'
                ], 404);
            }

            // Format products data
            $listings = [];
            if ($user->products) {
                $listings = $user->products->map(function ($product) {
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'category' => $product->category ?? 'Tidak ada kategori',
                        'price' => number_format($product->price, 0, ',', '.'),
                        'status' => $product->status ?? 'Aktif',
                        'publishedAt' => $product->created_at->format('d M Y'),
                        'image' => is_array($product->images) && count($product->images) > 0 ? $product->images[0] : null,
                    ];
                });
            }

            // Format purchases data from transactions
            $purchases = [];
            if ($user->purchases) {
                $purchases = $user->purchases->map(function ($transaction) {
                    return [
                        'id' => $transaction->id,
                        'productName' => $transaction->product->name ?? 'Produk tidak tersedia',
                        'seller' => $transaction->product->user->name ?? 'Penjual tidak diketahui',
                        'price' => number_format($transaction->amount, 0, ',', '.'),
                        'status' => ucfirst($transaction->status),
                        'purchaseDate' => $transaction->created_at->format('d M Y'),
                    ];
                });
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'phone' => $user->phone ?? '-',
                        'location' => $user->location ?? '-',
                        'avatar' => $user->avatar ? url('storage/' . $user->avatar) : null,
                        'status' => $user->is_active ? 'Aktif' : 'Diblokir',
                        'joined' => $user->created_at->format('d M Y'),
                    ],
                    'listings' => $listings,
                    'purchases' => $purchases
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching user profile', [
                'user_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data pengguna'
            ], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan'], 404);
        }

        $isActive = $request->input('status') === 'Aktif';

        // Catat aktivitas admin untuk block/unblock user
        try {
            $adminName = $request->user()->name;
            if ($isActive) {
                // Admin mengaktifkan kembali user
                $actionText = "Admin {$adminName} mengaktifkan kembali pengguna {$user->name}";
            } else {
                // Admin memblokir user
                $actionText = "Admin {$adminName} memblokir pengguna {$user->name}";
            }

            Activity::create([
                'user_id' => null,
                'admin_id' => $request->user()->id,
                'action' => $actionText,
                'type' => 'admin',
            ]);
        } catch (\Exception $e) {
            Log::error('Gagal mencatat aktivitas admin user', ['error' => $e->getMessage()]);
        }

        $user->is_active = $isActive;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Status pengguna berhasil diperbarui']);
    }
}