<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;

class UserCategoriesController extends Controller
{
    /**
     * Mengambil daftar kategori untuk user
     */
    public function index(): JsonResponse
    {
        $categories = Category::orderBy('name')->get();

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}