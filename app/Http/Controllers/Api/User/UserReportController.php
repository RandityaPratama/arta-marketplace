<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportReason;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserReportController extends Controller
{
    /**
     * Get all report reasons
     */
    public function getReportReasons()
    {
        try {
            $reasons = ReportReason::select('id', 'reason')
                ->orderBy('reason', 'asc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reasons
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil alasan laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Submit a new report (laporan iklan)
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'report_reason_id' => 'required|exists:report_reasons,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Get product to get seller_id
            $product = Product::findOrFail($request->product_id);

            // Check if user already reported this product
            $existingReport = Report::where('reporter_id', auth()->id())
                ->where('product_id', $request->product_id)
                ->where('status', '!=', 'resolved')
                ->first();

            if ($existingReport) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah melaporkan produk ini sebelumnya'
                ], 400);
            }

            // Create report
            $report = Report::create([
                'reporter_id' => auth()->id(),
                'product_id' => $request->product_id,
                'seller_id' => $product->user_id,
                'report_reason_id' => $request->report_reason_id,
                'status' => 'pending',
            ]);

            // Load relationships
            $report->load(['reporter', 'product', 'seller', 'reportReason']);

            return response()->json([
                'success' => true,
                'message' => 'Laporan berhasil dikirim',
                'data' => $report
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengirim laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's own reports
     */
    public function myReports()
    {
        try {
            $reports = Report::with(['product', 'seller', 'reportReason'])
                ->where('reporter_id', auth()->id())
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $reports
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengambil laporan',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
