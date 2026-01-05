<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
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
                    'action' => 'Memperbarui profil akun',
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
}