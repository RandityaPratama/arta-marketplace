<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsUserMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
       
        if (!$request->user() || !($request->user() instanceof \App\Models\User)) {
            return response()->json([
                'success' => false,
                'message' => 'Akses ditolak. User tidak ditemukan.',
                'error_code' => 'USER_REQUIRED'
            ], 403);
        }

       
        if (property_exists($request->user(), 'is_active') && !$request->user()->is_active) {
            return response()->json([
                'success' => false,
                'message' => 'Akun dinonaktifkan'
            ], 403);
        }

        return $next($request);
    }
}