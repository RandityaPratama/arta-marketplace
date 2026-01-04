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
        $user = User::with(['products'])->find($id);

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone ?? '-',
                    'location' => $user->address ?? '-', // Asumsi ada kolom address
                    'status' => $user->is_active ? 'Aktif' : 'Diblokir',
                    'joined' => $user->created_at->format('d M Y'),
                ],
                'listings' => $user->products, // Produk yang dijual user
                'purchases' => [] // Kosongkan dulu jika belum ada relasi transaksi
            ]
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Pengguna tidak ditemukan'], 404);
        }
        
        $isActive = $request->input('status') === 'Aktif';

        // Catat aktivitas hanya jika admin memblokir pengguna (status menjadi tidak aktif)
        if (!$isActive) {
            try {
                $adminName = $request->user()->name;
                Activity::create([
                    'user_id' => null,
                    'admin_id' => $request->user()->id,
                    'action' => "Admin {$adminName} memblokir pengguna {$user->name}",
                    'type' => 'admin',
                ]);
            } catch (\Exception $e) {
                Log::error('Gagal mencatat aktivitas blokir user', ['error' => $e->getMessage()]);
            }
        }
        
        $user->is_active = $isActive;
        $user->save();

        return response()->json(['success' => true, 'message' => 'Status pengguna berhasil diperbarui']);
    }
}