<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class UserNotificationController extends Controller
{
    /**
     * Get paginated notifications for authenticated user
     */
    public function index(Request $request)
    {
        try {
            $userId = auth()->id();

            $query = Notification::where('user_id', $userId)
                ->orderBy('created_at', 'desc');

            $notifications = $query->paginate(20);

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil notifikasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark specific notification as read
     */
    public function markAsRead($id)
    {
        try {
            $userId = auth()->id();

            $notification = Notification::where('id', $id)
                ->where('user_id', $userId)
                ->firstOrFail();

            $notification->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Notifikasi telah ditandai sebagai dibaca'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Notifikasi tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Mark all notifications as read for user
     */
    public function markAllAsRead()
    {
        try {
            $userId = auth()->id();

            Notification::where('user_id', $userId)
                ->where('is_read', false)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Semua notifikasi telah ditandai sebagai dibaca'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menandai notifikasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get count of unread notifications
     */
    public function unreadCount()
    {
        try {
            $userId = auth()->id();

            $count = Notification::where('user_id', $userId)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $count
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil jumlah notifikasi',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
