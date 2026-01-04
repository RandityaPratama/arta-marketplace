<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\UserAuthController;
use App\Http\Controllers\Api\User\UserProductController;

// Public routes
Route::post('/register', [UserAuthController::class, 'register']);
Route::post('/login', [UserAuthController::class, 'login']);

  
// Protected routes (memerlukan token)
Route::middleware('auth:sanctum', 'isUser')->group(function () {
     Route::post('/logout', [UserAuthController::class, 'logout']);  
    Route::get('/me', [UserAuthController::class, 'me']);
    Route::post('/refresh', [UserAuthController::class, 'refresh']);
    Route::post('/products', [UserProductController::class, 'addProduct']);
    Route::get('/products', [UserProductController::class, 'getProducts']);
});