<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
   
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

       
        $admin = Admin::where('email', $request->email)->first();

       
        if (!$admin) {
            Log::channel('admin')->warning('Admin login attempt - email not found', [
                'email' => $request->email,
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

       
        if (!Hash::check($request->password, $admin->password)) {
            Log::channel('admin')->warning('Admin login attempt - wrong password', [
                'admin_id' => $admin->id,
                'email' => $admin->email,
                'ip' => $request->ip()
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

       
        if (property_exists($admin, 'is_active') && !$admin->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun admin dinonaktifkan'
            ], 403);
        }

       
        $admin->update(['last_login_at' => now()]);

       
        $admin->tokens()->delete();

       
        $token = $admin->createToken('admin_token', ['admin:*'])->plainTextToken;

       
        Log::channel('admin')->info('Admin login successful', [
            'admin_id' => $admin->id,
            'email' => $admin->email,
            'ip' => $request->ip()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Login admin berhasil',
            'data' => [
                'admin' => $admin->makeHidden(['password', 'remember_token']),
                'token' => $token,
                'token_type' => 'Bearer',
                'is_super_admin' => $admin->is_super_admin,
            ]
        ]);
    }
   

public function logout(Request $request)
{
    try {       
        $admin = $request->user();

       
        if (! $admin || ! ($admin instanceof Admin)) {
            Log::warning('Admin logout failed: not admin', [
                'user' => $admin
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        $token = $admin->currentAccessToken();

        Log::channel('admin')->info('Admin logout attempt', [
            'admin_id' => $admin->id,
            'email' => $admin->email,
            'has_token' => (bool) $token,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if (! $token) {
            Log::warning('Admin logout failed: token not found', [
                'admin_id' => $admin->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan'
            ], 401);
        }

        $request->user()->currentAccessToken()->delete();

        Log::channel('admin')->info('Admin logout success', [
            'admin_id' => $admin->id,
            'token_id' => $token->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logout admin berhasil'
        ]);

    } catch (\Throwable $e) {

        Log::channel('admin')->error('Admin logout error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Gagal logout admin'
        ], 500);
    }
}


   public function me(Request $request)
    {
        $admin = $request->user();
        $admin->makeHidden(['password', 'remember_token']);
        
        return response()->json([
            'success' => true,
            'data' => [
                'admin' => $admin
            ]
        ]);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $admin = $request->user();

        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password saat ini salah'
            ], 422);
        }

        $admin->update([
            'password' => Hash::make($request->new_password)
        ]);

        $admin->tokens()->delete();

        Log::channel('admin')->info('Admin changed password', [
            'admin_id' => $admin->id
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah. Silakan login kembali.'
        ]);
    }
    
    public function forgotPassword(Request $request)
    {
        return response()->json([
            'success' => false,
            'message' => 'Reset password hanya bisa dilakukan via administrator system.'
        ], 403);
    }
}