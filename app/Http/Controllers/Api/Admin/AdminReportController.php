<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AdminReportController extends Controller
{
    /**
     * Get all reports (laporan iklan)
     */
    public function index(Request $request)
    {
        try {
            $query = Report::with(['reporter', 'product', 'seller', 'reportReason', 'handler']);

            // Filter by status
            if ($request->has('status') && $request->status != 'all') {
                $query->where('status', $request->status);
            }

            // Search
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->whereHas('product', function($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('reporter', function($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('seller', function($q2) use ($search) {
                        $q2->where('name', 'like', "%{$search}%");
                    });
                });
            }

            $reports = $query->orderBy('created_at', 'desc')->get();

            // Format data untuk frontend
            $formattedReports = $reports->map(function($report) {
                return [
                    'id' => $report->id,
                    'reporter' => [
                        'id' => $report->reporter->id,
                        'name' => $report->reporter->name,
                        'email' => $report->reporter->email,
                    ],
                    'product' => [
                        'id' => $report->product->id,
                        'name' => $report->product->name,
                        'price' => $report->product->price,
                        'images' => $report->product->images,
                    ],
                    'seller' => [
                        'id' => $report->seller->id,
                        'name' => $report->seller->name,
                        'email' => $report->seller->email,
                    ],
                    'reason' => $report->reportReason->reason,
                    'status' => $report->status,
                    'admin_notes' => $report->admin_notes,
                    'handler' => $report->handler ? [
                        'id' => $report->handler->id,
                        'name' => $report->handler->name,
                    ] : null,
                    'created_at' => $report->created_at->format('Y-m-d H:i:s'),
                    'handled_at' => $report->handled_at ? $report->handled_at->format('Y-m-d H:i:s') : null,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $formattedReports
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil data laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get report detail
     */
    public function show($id)
    {
        try {
            $report = Report::with(['reporter', 'product', 'seller', 'reportReason', 'handler'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $report->id,
                    'reporter' => [
                        'id' => $report->reporter->id,
                        'name' => $report->reporter->name,
                        'email' => $report->reporter->email,
                    ],
                    'product' => [
                        'id' => $report->product->id,
                        'name' => $report->product->name,
                        'price' => $report->product->price,
                        'description' => $report->product->description,
                        'images' => $report->product->images,
                        'status' => $report->product->status,
                    ],
                    'seller' => [
                        'id' => $report->seller->id,
                        'name' => $report->seller->name,
                        'email' => $report->seller->email,
                    ],
                    'reason' => $report->reportReason->reason,
                    'status' => $report->status,
                    'admin_notes' => $report->admin_notes,
                    'handler' => $report->handler ? [
                        'id' => $report->handler->id,
                        'name' => $report->handler->name,
                    ] : null,
                    'created_at' => $report->created_at->format('Y-m-d H:i:s'),
                    'handled_at' => $report->handled_at ? $report->handled_at->format('Y-m-d H:i:s') : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Laporan tidak ditemukan',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update report status
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,in_progress,resolved,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $report = Report::findOrFail($id);

            $report->update([
                'status' => $request->status,
                'admin_notes' => $request->admin_notes,
                'handled_by' => auth()->id(),
                'handled_at' => now(),
            ]);

            $report->load(['reporter', 'product', 'seller', 'reportReason', 'handler']);

            return response()->json([
                'success' => true,
                'message' => 'Status laporan berhasil diupdate',
                'data' => $report
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupdate status laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete reported product
     */
    public function deleteProduct($id)
    {
        try {
            $report = Report::findOrFail($id);
            $product = Product::findOrFail($report->product_id);

            // Soft delete atau hard delete product
            $product->delete();

            // Update report status
            $report->update([
                'status' => 'resolved',
                'admin_notes' => 'Produk telah dihapus oleh admin',
                'handled_by' => auth()->id(),
                'handled_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Produk berhasil dihapus'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus produk',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Block seller (set is_active = false)
     */
    public function blockSeller($id)
    {
        try {
            $report = Report::findOrFail($id);
            $seller = \App\Models\User::findOrFail($report->seller_id);

            // Blokir seller
            $seller->is_active = false;
            $seller->save();

            // Update report status
            $report->update([
                'status' => 'resolved',
                'admin_notes' => 'Penjual telah diblokir oleh admin',
                'handled_by' => auth()->id(),
                'handled_at' => now(),
            ]);

            // Log activity
            \App\Models\Activity::create([
                'user_id' => null,
                'admin_id' => auth()->id(),
                'action' => "Admin memblokir penjual {$seller->name} dari laporan #{$report->id}",
                'type' => 'admin',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Penjual berhasil diblokir'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memblokir penjual',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
