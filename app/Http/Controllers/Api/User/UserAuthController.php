<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class UserAuthController extends Controller
{
    /**
     * Register new user
     */
    public function register(Request $request)
    {
        // Validasi data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'phone' => 'nullable|string|max:20',
            'location' => 'nullable|string|max:255',
        ]);

        // Jika validasi gagal
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Buat user baru
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'location' => $request->location,
            ]);

            // Catat aktivitas ke database
            try {
                Activity::create([
                    'user_id' => $user->id,
                    'action' => $user->name . ' mendaftar sebagai pengguna baru',
                    'type' => 'pengguna',
                ]);
            } catch (\Exception $e) {
                Log::error('Gagal mencatat aktivitas registrasi user', ['error' => $e->getMessage()]);
            }

            // Buat token untuk user menggunakan Sanctum
            $token = $user->createToken('auth_token')->plainTextToken;

            // Sembunyikan password dari response
            $user->makeHidden(['password', 'remember_token']);

            return response()->json([
                'success' => true,
                'message' => 'Registrasi berhasil',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan server',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user
     */
    public function login(Request $request)
    {
        // Validasi login
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        

        // Cek kredensial
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah'
            ], 401);
        }

        // Cek status aktif user
        if (!$user->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dinonaktifkan'
            ], 403);
        }

        // Buat/Hapus token lama (optional: untuk single device login)
        // $user->tokens()->delete();

        // Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;

        // Sembunyikan sensitive data
        $user->makeHidden(['password', 'remember_token']);

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration') // jika ada config
            ]
        ]);
    }

    /**
     * Logout user (revoke current token)
     */   

public function logout(Request $request)
{
    try {
        $user = $request->user();
        $token = $user?->currentAccessToken();

        Log::info('Logout attempt', [
            'user_id' => $user?->id,
            'has_token' => (bool) $token,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if (!$user || !$token) {
            Log::warning('Logout failed: user or token not found', [
                'user_id' => $user?->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Token tidak ditemukan'
            ], 401);
        }

        $token->delete();

        Log::info('Logout success', [
            'user_id' => $user->id,
            'token_id' => $token->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Logout berhasil'
        ]);

    } catch (\Exception $e) {

        Log::error('Logout error', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Gagal logout',
            'error' => $e->getMessage()
        ], 500);
    }
}


    /**
     * Get authenticated user profile
     */
    public function me(Request $request)
    {
        $user = $request->user();
        $user->makeHidden(['password', 'remember_token']);
        
        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user
            ]
        ]);
    }

    /**
     * Refresh token (optional)
     */
    public function refresh(Request $request)
    {
        $user = $request->user();
        
        // Hapus token lama
        $request->user()->currentAccessToken()->delete();
        
        // Buat token baru
        $token = $user->createToken('auth_token')->plainTextToken;
        
        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'token_type' => 'Bearer'
            ]
        ]);
    }
}