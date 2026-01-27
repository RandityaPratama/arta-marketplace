<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;

class UserCategoriesController extends Controller
{
    
    public function index(): JsonResponse
    {
        $categories = Category::orderBy('name')->get();
        $counts = Product::selectRaw('category, COUNT(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $categories = $categories->map(function ($category) use ($counts) {
            $category->total = (int) ($counts[$category->name] ?? 0);
            return $category;
        });

        return response()->json([
            'success' => true,
            'data' => $categories
        ]);
    }
}
