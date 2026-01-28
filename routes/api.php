<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\UserAuthController;
use App\Http\Controllers\Api\User\UserProductController;
use App\Http\Controllers\Api\User\UserProfileController;
use App\Http\Controllers\Api\User\UserFavoriteController;
use App\Http\Controllers\Api\User\UserCategoriesController;
use App\Http\Controllers\Api\User\UserChatController;
use App\Http\Controllers\Api\User\UserReportController;
use App\Http\Controllers\Api\User\UserPaymentController;
use App\Http\Controllers\Api\User\UserNotificationController;

// Admin routes
use App\Http\Controllers\Api\Admin\AdminAuthController;
use App\Http\Controllers\Api\Admin\AdminDashboardController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use App\Http\Controllers\Api\Admin\AdminProductController;
use App\Http\Controllers\Api\Admin\AdminReportController;
use App\Http\Controllers\Api\Admin\AdminActivityController;
use App\Http\Controllers\Api\Admin\AdminSettingsController;

// Public routes
Route::post('/register', [UserAuthController::class, 'register']);
Route::post('/login', [UserAuthController::class, 'login']);
Route::get('/categories', [UserCategoriesController::class, 'index']);
Route::post('/forgot-password', [UserAuthController::class, 'forgotPassword']);
Route::post('/reset-password', [UserAuthController::class, 'resetPassword']);

// Optional auth routes (can be accessed by both guest and authenticated users)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/popular-products', [UserFavoriteController::class, 'popular']);
});

// Protected routes (memerlukan token)
Route::middleware('auth:sanctum', 'isUser')->group(function () {
     Route::post('/logout', [UserAuthController::class, 'logout']);
    Route::get('/profile', [UserAuthController::class, 'profile']);
    Route::post('/profile/update', [UserProfileController::class, 'update']);
    Route::post('/profile/avatar', [UserProfileController::class, 'updateAvatar']);
    Route::delete('/profile/avatar', [UserProfileController::class, 'deleteAvatar']);
    Route::post('/refresh', [UserAuthController::class, 'refresh']);
    Route::post('/products', [UserProductController::class, 'addProduct']);
    Route::get('/products', [UserProductController::class, 'getProducts']);
    Route::get('/products/{id}', [UserProductController::class, 'getProductById']);
    Route::put('/products/{id}', [UserProductController::class, 'update']);
    Route::delete('/products/{id}', [UserProductController::class, 'deleteProduct']);
    Route::get('/favorites', [UserFavoriteController::class, 'index']);
    Route::post('/favorites/toggle', [UserFavoriteController::class, 'toggle']);

    // Chat routes
    Route::get('/conversations', [UserChatController::class, 'getConversations']);
    Route::post('/conversations', [UserChatController::class, 'getOrCreateConversation']);
    Route::get('/conversations/{id}/messages', [UserChatController::class, 'getMessages']);
    Route::post('/conversations/{id}/messages', [UserChatController::class, 'sendMessage']);
    Route::put('/conversations/{conversationId}/messages/{messageId}', [UserChatController::class, 'editMessage']);
    Route::delete('/conversations/{conversationId}/messages/{messageId}', [UserChatController::class, 'deleteMessage']);
    Route::post('/conversations/{id}/read', [UserChatController::class, 'markAsRead']);
    Route::delete('/conversations/{id}', [UserChatController::class, 'deleteConversation']);

    // Report routes
    Route::get('/report-reasons', [UserReportController::class, 'getReportReasons']);
    Route::post('/reports', [UserReportController::class, 'store']);
    Route::get('/my-reports', [UserReportController::class, 'myReports']);
    Route::post('/checkout', [UserPaymentController::class, 'checkout']);
    Route::post('/checkout/cod', [UserPaymentController::class, 'checkoutCod']);
    Route::get('/transactions', [UserPaymentController::class, 'index']);
    Route::post('/transactions/{id}/complete', [UserPaymentController::class, 'completeCod']);
    Route::post('/transactions/{id}/cancel', [UserPaymentController::class, 'cancelCod']);

    // Notification routes
    Route::get('/notifications', [UserNotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [UserNotificationController::class, 'markAsRead']);
    Route::put('/notifications/mark-all-read', [UserNotificationController::class, 'markAllAsRead']);
    Route::get('/notifications/unread-count', [UserNotificationController::class, 'unreadCount']);
});

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/dashboard/stats', [AdminDashboardController::class, 'getStats']);
});
