<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ReportReason;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AdminSettingsController extends Controller
{
    /**
     * Mengambil semua data pengaturan (Categories, Report Reasons)
     */
    public function index()
    {
        $categories = Category::orderBy('name')->get();
        $reportReasons = ReportReason::orderBy('id')->get();

        return response()->json([
            'success' => true,
            'data' => [
                'categories' => $categories,
                'report_reasons' => $reportReasons,
            ]
        ]);
    }

    /**
     * Menambah Kategori Baru
     */
    public function storeCategory(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|unique:categories,name|max:50',
            'icon' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first()
            ], 422);
        }

        // Batasi jumlah kategori (opsional, misal max 20)
        if (Category::count() >= 20) {
            return response()->json([
                'success' => false,
                'message' => 'Jumlah kategori maksimal telah tercapai.'
            ], 400);
        }

        $name = $request->name;
        $slug = Str::slug($name);

        // Pastikan slug unik
        if (Category::where('slug', $slug)->exists()) {
            $slug = $slug . '-' . uniqid();
        }

        $category = Category::create([
            'name' => $name,
            'slug' => $slug,
            'icon' => $request->icon,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil ditambahkan',
            'data' => $category
        ]);
    }

    /**
     * Menghapus Kategori
     */
    public function destroyCategory($id)
    {
        $deleted = Category::destroy($id);

        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Kategori berhasil dihapus']);
        }

        return response()->json(['success' => false, 'message' => 'Kategori tidak ditemukan'], 404);
    }

    /**
     * Menambah Alasan Laporan Baru
     */
    public function storeReportReason(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'required|string|unique:report_reasons,reason|max:100',
            'type' => 'nullable|string|in:general,user,product'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'message' => $validator->errors()->first()], 422);
        }

        $reportReason = ReportReason::create([
            'reason' => $request->reason,
            'type' => $request->type ?? 'general',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alasan laporan berhasil ditambahkan',
            'data' => $reportReason
        ]);
    }

    /**
     * Menghapus Alasan Laporan
     */
    public function destroyReportReason($id)
    {
        $deleted = ReportReason::destroy($id);

        if ($deleted) {
            return response()->json(['success' => true, 'message' => 'Alasan laporan berhasil dihapus']);
        }

        return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
    }

    /**
     * Update method (Placeholder untuk kompatibilitas route lama)
     */
    public function update(Request $request)
    {
        return response()->json(['success' => false, 'message' => 'Endpoint ini tidak digunakan. Gunakan endpoint spesifik.'], 404);
    }
}
