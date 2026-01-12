<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Report;
use App\Models\ReportReason;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;


class UserReportController extends Controller
{
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

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'report_reason_id' => 'required|exists:report_reasons,id',
            'transaction_id' => 'nullable|exists:transactions,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $product = Product::findOrFail($request->product_id);

            $transactionId = $request->transaction_id;
            $reportType = $transactionId ? 'transaksi' : 'iklan';

            $existingReportQuery = Report::where('reporter_id', Auth::id())
                ->where('product_id', $request->product_id)
                ->where('status', '!=', 'resolved')
                ->where('status', '!=', 'rejected');

            if ($transactionId) {
                $existingReportQuery->where('transaction_id', $transactionId);
            } else {
                $existingReportQuery->where('report_type', 'iklan');
            }

            $existingReport = $existingReportQuery->first();

            if ($existingReport) {
                return response()->json([
                    'success' => false,
                    'message' => 'Anda sudah melaporkan ' . ($transactionId ? 'transaksi' : 'produk') . ' ini sebelumnya'
                ], 400);
            }

            $report = Report::create([
                'reporter_id' => Auth::id(),
                'product_id' => $request->product_id,
                'seller_id' => $product->user_id,
                'report_reason_id' => $request->report_reason_id,
                'transaction_id' => $transactionId,
                'report_type' => $reportType,
                'status' => 'pending',
            ]);

            $report->load(['reporter', 'product', 'seller', 'reportReason', 'transaction']);

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

    public function myReports()
    {
        try {
            $reports = Report::with(['product', 'seller', 'reportReason', 'transaction'])
                ->where('reporter_id', Auth::id())
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
