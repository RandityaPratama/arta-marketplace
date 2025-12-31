<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        // Cek apakah user adalah instance dari Admin model
        if (!$request->user() || !($request->user() instanceof \App\Models\Admin)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. Hanya admin yang diizinkan.',
                'error_code' => 'ADMIN_REQUIRED'
            ], 403);
        }

        // Cek apakah admin aktif (jika ada field is_active)
        if (property_exists($request->user(), 'is_active') && !$request->user()->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun admin dinonaktifkan'
            ], 403);
        }

        return $next($request);
    }
}