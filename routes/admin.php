<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminProductController;


Route::post('/login', [AdminAuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);  
    Route::get('/products', [AdminProductController::class, 'getAllProducts']);    
    Route::put('/products/{id}/status', [AdminProductController::class, 'updateStatus']);
});