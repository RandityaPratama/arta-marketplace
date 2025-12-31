<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AuthController;

// ✅ PUBLIC ADMIN ROUTES (tanpa middleware)
Route::post('/login', [AuthController::class, 'login']);

// ✅ PROTECTED ADMIN ROUTES (dengan middleware)
Route::middleware(['auth:admin-api', 'admin'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::get('/dashboard', function () {
        return response()->json(['message' => 'Admin Dashboard']);
    });
});