<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class AdminProfileController extends Controller
{
    /**
     * Get admin profile
     */
    public function show(Request $request)
    {
        try {
            $admin = $request->user();
            
            return response()->json([
                'success' => true,
                'data' => [
                    'admin' => [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'email' => $admin->email,
                        'phone' => $admin->phone,
                        'avatar' => $admin->avatar ? url('storage/' . $admin->avatar) : null,
                        'is_super_admin' => $admin->is_super_admin,
                        'last_login_at' => $admin->last_login_at,
                        'created_at' => $admin->created_at,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching admin profile', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data profil'
            ], 500);
        }
    }

    /**
     * Update admin profile
     */
    public function update(Request $request)
    {
        try {
            $admin = $request->user();

            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:admins,email,' . $admin->id,
                'phone' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            $admin->update([
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
            ]);

            Log::channel('admin')->info('Admin updated profile', [
                'admin_id' => $admin->id,
                'changes' => $request->only(['name', 'email', 'phone'])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profil berhasil diperbarui',
                'data' => [
                    'admin' => [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'email' => $admin->email,
                        'phone' => $admin->phone,
                        'avatar' => $admin->avatar ? url('storage/' . $admin->avatar) : null,
                        'is_super_admin' => $admin->is_super_admin,
                    ]
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating admin profile', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui profil'
            ], 500);
        }
    }

    /**
     * Update admin avatar
     */
    public function updateAvatar(Request $request)
    {
        try {
            $admin = $request->user();

            $validator = Validator::make($request->all(), [
                'avatar' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Delete old avatar if exists
            if ($admin->avatar && Storage::disk('public')->exists($admin->avatar)) {
                Storage::disk('public')->delete($admin->avatar);
            }

            // Store new avatar
            $avatarPath = $request->file('avatar')->store('avatars/admins', 'public');

            $admin->update([
                'avatar' => $avatarPath
            ]);

            Log::channel('admin')->info('Admin updated avatar', [
                'admin_id' => $admin->id,
                'avatar_path' => $avatarPath
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Avatar berhasil diperbarui',
                'data' => [
                    'avatar' => url('storage/' . $avatarPath)
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error updating admin avatar', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui avatar'
            ], 500);
        }
    }

    /**
     * Change admin password
     */
    public function changePassword(Request $request)
    {
        try {
            $admin = $request->user();

            $validator = Validator::make($request->all(), [
                'current_password' => 'required',
                'new_password' => 'required|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validasi gagal',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Check current password
            if (!Hash::check($request->current_password, $admin->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Password saat ini salah'
                ], 422);
            }

            // Update password
            $admin->update([
                'password' => Hash::make($request->new_password)
            ]);

            // Revoke all tokens
            $admin->tokens()->delete();

            Log::channel('admin')->info('Admin changed password', [
                'admin_id' => $admin->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password berhasil diubah. Silakan login kembali.'
            ]);
        } catch (\Exception $e) {
            Log::error('Error changing admin password', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengubah password'
            ], 500);
        }
    }
}
