<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\Request;

class AdminActivityController extends Controller
{
    /**
     * Mengambil daftar aktivitas dengan filter dan pagination
     */
    public function getActivities(Request $request)
    {
        $query = Activity::with(['user', 'admin']);

        // Filter berdasarkan type
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        // Filter berdasarkan search (cari di action)
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where('action', 'like', "%{$search}%");
        }

        // Filter berdasarkan date range
        if ($request->has('date_from') && $request->date_from != '') {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to != '') {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Pagination
        $perPage = $request->get('per_page', 20);
        $activities = $query->orderBy('created_at', 'desc')->paginate($perPage);

        // Format data untuk response
        $formattedActivities = $activities->getCollection()->map(function ($activity) {
            return [
                'id' => $activity->id,
                'action' => $activity->action,
                'type' => $activity->type,
                'user_name' => $activity->user ? $activity->user->name : null,
                'admin_name' => $activity->admin ? $activity->admin->name : null,
                'created_at' => $activity->created_at->format('Y-m-d H:i:s'),
                'created_at_human' => $activity->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedActivities,
            'pagination' => [
                'total' => $activities->total(),
                'per_page' => $activities->perPage(),
                'current_page' => $activities->currentPage(),
                'last_page' => $activities->lastPage(),
                'from' => $activities->firstItem(),
                'to' => $activities->lastItem(),
            ]
        ]);
    }
}
