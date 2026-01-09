<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\User\UserAuthController;
use App\Http\Controllers\Api\User\UserProductController;
use App\Http\Controllers\Api\User\UserProfileController;
use App\Http\Controllers\Api\User\UserFavoriteController;
use App\Http\Controllers\Api\User\UserCategoriesController;
use App\Http\Controllers\Api\User\UserChatController;
use App\Http\Controllers\Api\User\UserReportController;

// Public routes
Route::post('/register', [UserAuthController::class, 'register']);
Route::post('/login', [UserAuthController::class, 'login']);
Route::get('/categories', [UserCategoriesController::class, 'index']);
Route::get('/popular-products', [UserFavoriteController::class, 'popular']);

  
// Protected routes (memerlukan token)
Route::middleware('auth:sanctum', 'isUser')->group(function () {
     Route::post('/logout', [UserAuthController::class, 'logout']);  
    Route::get('/profile', [UserAuthController::class, 'profile']);
    Route::post('/profile/update', [UserProfileController::class, 'update']);
    Route::post('/refresh', [UserAuthController::class, 'refresh']);
    Route::post('/products', [UserProductController::class, 'addProduct']);
    Route::get('/products', [UserProductController::class, 'getProducts']);
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
});
