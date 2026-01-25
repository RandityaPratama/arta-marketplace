<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Models\Activity;

class UserProfileController extends Controller
{
    /**
     * Update user profile details
     */
    public function update(Request $request)
    {
        $user = $request->user();

        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // 2. Update Data User
            $user->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'location' => $request->location,
            ]);

            // 3. Catat Aktivitas
            try {
                Activity::create([
                    'user_id' => $user->id,
                    'action' => $user->name . ' memperbarui profil',
                    'type' => 'pengguna',
                ]);
            } catch (\Exception $e) {
                Log::warning('Failed to log profile update activity: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data' => $user
            ]);

        } catch (\Exception $e) {
            Log::error('Profile update error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
            ], 500);
        }
    }

    /**
     * Update user avatar
     */
    public function updateAvatar(Request $request)
    {
        $user = $request->user();

        // Validasi file avatar
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // max 2MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Hapus avatar lama jika ada
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }

            // Upload avatar baru
            $avatarPath = $request->file('avatar')->store('avatars/users', 'public');

            // Update user avatar
            $user->update([
                'avatar' => $avatarPath
            ]);

            // Catat aktivitas
            try {
                Activity::create([
                    'user_id' => $user->id,
                    'action' => $user->name . ' mengubah foto profil',
                    'type' => 'pengguna',
                ]);
            } catch (\Exception $e) {
                Log::warning('Failed to log avatar update activity: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Avatar berhasil diperbarui',
                'data' => [
                    'avatar' => $avatarPath,
                    'avatar_url' => Storage::url($avatarPath)
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Avatar update error', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat mengupload avatar',
            ], 500);
        }
    }

    /**
     * Delete user avatar
     */
    public function deleteAvatar(Request $request)
    {
        $user = $request->user();

        if (!$user->avatar) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak ada avatar untuk dihapus'
            ], 404);
        }

        try {
            // Hapus file avatar dari storage
            Storage::disk('public')->delete($user->avatar);

            // Update kolom avatar di database menjadi null
            $user->update(['avatar' => null]);

            // Catat aktivitas
            try {
                Activity::create([
                    'user_id' => $user->id,
                    'action' => $user->name . ' menghapus foto profil',
                    'type' => 'pengguna',
                ]);
            } catch (\Exception $e) {
                Log::warning('Failed to log avatar delete activity: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Avatar berhasil dihapus',
            ]);

        } catch (\Exception $e) {
            Log::error('Avatar delete error', ['error' => $e->getMessage()]);
            return response()->json(['success' => false, 'message' => 'Gagal menghapus avatar'], 500);
        }
    }
}
