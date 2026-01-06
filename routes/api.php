<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\UserAuthController;
use App\Http\Controllers\Api\User\UserProductController;
use App\Http\Controllers\Api\User\UserProfileController;
use App\Http\Controllers\Api\User\UserFavoriteController;
use App\Http\Controllers\Api\User\UserCategoriesController;

// Public routes
Route::post('/register', [UserAuthController::class, 'register']);
Route::post('/login', [UserAuthController::class, 'login']);
Route::get('/categories', [UserCategoriesController::class, 'index']);

  
// Protected routes (memerlukan token)
Route::middleware('auth:sanctum', 'isUser')->group(function () {
     Route::post('/logout', [UserAuthController::class, 'logout']);  
    Route::get('/profile', [UserAuthController::class, 'profile']);
    Route::post('/profile/update', [UserProfileController::class, 'update']);
    Route::post('/refresh', [UserAuthController::class, 'refresh']);
    Route::post('/products', [UserProductController::class, 'addProduct']);
    Route::get('/products', [UserProductController::class, 'getProducts']);
    Route::get('/favorites', [UserFavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [UserFavoriteController::class, 'toggle']);
});
