<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class LandingPageController extends Controller
{
    /**
     * Display the landing page.
     */
    public function index()
    {
        // Get ALL products (ambil semua produk tanpa batasan)
        $allProducts = Product::with('kategori')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Tambahkan is_best_seller attribute ke setiap produk
        $bestSellingIds = TransactionDetail::select('product_id', DB::raw('SUM(jumlah) as total_sold'))
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(4)
            ->pluck('product_id')
            ->toArray();
        
        // Transform allProducts dengan menambah is_best_seller
        $allProducts->transform(function ($product) use ($bestSellingIds) {
            $product->is_best_seller = in_array($product->id, $bestSellingIds);
            return $product;
        });
        
        // Get featured products (8 produk terbaru)
        $featuredProducts = Product::with('kategori')
            ->orderBy('created_at', 'desc')
            ->limit(8)
            ->get();
        
        $featuredProducts->transform(function ($product) use ($bestSellingIds) {
            $product->is_best_seller = in_array($product->id, $bestSellingIds);
            return $product;
        });
        
        // Get categories for showcase
        $categories = Category::withCount('products')
            ->having('products_count', '>', 0)
            ->limit(6)
            ->get();
        
        // Get popular products (best selling from transactions)
        if (empty($bestSellingIds)) {
            $popularProducts = Product::with('kategori')
                ->orderBy('created_at', 'desc')
                ->limit(4)
                ->get();
        } else {
            $popularProducts = Product::with('kategori')
                ->whereIn('id', $bestSellingIds)
                ->get();
            
            // Urutkan berdasarkan urutan ID dari query sebelumnya
            $popularProducts = $popularProducts->sortBy(function ($product) use ($bestSellingIds) {
                return array_search($product->id, $bestSellingIds);
            })->values();
        }
        
        $popularProducts->transform(function ($product) use ($bestSellingIds) {
            $product->is_best_seller = true;
            return $product;
        });
        
        return Inertia::render('LandingPage', [
            'allProducts' => $allProducts,
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
            'popularProducts' => $popularProducts,
        ]);
    }

    /**
     * Display all menu page.
     */
    public function menu()
    {
        // Get ALL products (ambil semua produk)
        $allProducts = Product::with('kategori')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Tambahkan is_best_seller attribute ke setiap produk
        $bestSellingIds = TransactionDetail::select('product_id', DB::raw('SUM(jumlah) as total_sold'))
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(10)
            ->pluck('product_id')
            ->toArray();
        
        // Transform allProducts dengan menambah is_best_seller
        $allProducts->transform(function ($product) use ($bestSellingIds) {
            $product->is_best_seller = in_array($product->id, $bestSellingIds);
            return $product;
        });
        
        // Get categories for filter
        $categories = Category::withCount('products')
            ->having('products_count', '>', 0)
            ->get();
        
        return Inertia::render('MenuPage', [
            'allProducts' => $allProducts,
            'categories' => $categories,
        ]);
    }
}