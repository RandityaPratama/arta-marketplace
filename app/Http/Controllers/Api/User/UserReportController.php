<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Activity;
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
            'evidence_images' => 'nullable|array',
            'evidence_images.*' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
        ], [
            'evidence_images.*.image' => 'File bukti harus berupa gambar.',
            'evidence_images.*.mimes' => 'Format foto bukti harus JPG, PNG, atau GIF.',
            'evidence_images.*.max' => 'Ukuran file maksimal 2MB per foto.',
            'evidence_images.array' => 'Format bukti tidak valid.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first() ?: 'Validasi gagal',
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

            $evidencePaths = [];
            if ($request->hasFile('evidence_images')) {
                foreach ($request->file('evidence_images') as $image) {
                    $evidencePaths[] = $image->store('reports/evidence', 'public');
                }
            }

            $report = Report::create([
                'reporter_id' => Auth::id(),
                'product_id' => $request->product_id,
                'seller_id' => $product->user_id,
                'report_reason_id' => $request->report_reason_id,
                'transaction_id' => $transactionId,
                'report_type' => $reportType,
                'evidence_images' => $evidencePaths,
                'status' => 'pending',
            ]);

            $report->load(['reporter', 'product', 'seller', 'reportReason', 'transaction']);

            // ✅ Catat aktivitas pelaporan
            try {
                $user = Auth::user();
                $reportTypeText = $transactionId ? 'transaksi' : 'iklan';
                Activity::create([
                    'user_id' => $user->id,
                    'action' => $user->name . ' melaporkan ' . $reportTypeText . ' ' . $product->name,
                    'type' => 'laporan',
                ]);
            } catch (\Exception $e) {
                \Illuminate\Support\Facades\Log::error('Gagal mencatat aktivitas pelaporan', ['error' => $e->getMessage()]);
            }

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
