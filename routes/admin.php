<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminActivityController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;
use App\Http\Controllers\Api\Admin\AdminReportController;


Route::post('/login', [AdminAuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'isAdmin'])->group(function () {
    Route::post('/logout', [AdminAuthController::class, 'logout']);
    Route::get('/me', [AdminAuthController::class, 'me']);

    // Activity routes
    Route::get('/activities', [AdminActivityController::class, 'getActivities']);

    Route::get('/products', [AdminProductController::class, 'getAllProducts']);
    Route::put('/products/{id}/status', [AdminProductController::class, 'updateStatus']);

    // Routes Manajemen Pengguna
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}/status', [AdminUserController::class, 'updateStatus']);

    // Routes Pengaturan Platform
    Route::get('/settings', [AdminSettingsController::class, 'index']);
    Route::post('/settings/categories', [AdminSettingsController::class, 'storeCategory']);
    Route::delete('/settings/categories/{id}', [AdminSettingsController::class, 'destroyCategory']);
    Route::post('/settings/report-reasons', [AdminSettingsController::class, 'storeReportReason']);
    Route::delete('/settings/report-reasons/{id}', [AdminSettingsController::class, 'destroyReportReason']);
    
    // Report routes
    Route::get('/reports', [AdminReportController::class, 'index']);
    Route::get('/reports/{id}', [AdminReportController::class, 'show']);
    Route::put('/reports/{id}/status', [AdminReportController::class, 'updateStatus']);
    Route::delete('/reports/{id}/product', [AdminReportController::class, 'deleteProduct']);
    Route::post('/reports/{id}/block-seller', [AdminReportController::class, 'blockSeller']);
});
