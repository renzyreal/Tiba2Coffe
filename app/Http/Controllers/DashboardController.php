<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Product;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    protected function isAdmin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    protected function isCashier(): bool
    {
        return auth()->user() && auth()->user()->isCashier();
    }

    public function index()
    {
        Carbon::setLocale('id');
        
        $user = auth()->user();
        $isAdmin = $this->isAdmin();
        
        if ($isAdmin) {
            // Admin: melihat semua data
            $todaySales = Transaction::whereDate('tanggal', today())->sum('total');
            $todayTransactions = Transaction::whereDate('tanggal', today())->count();
            $monthlySales = Transaction::whereMonth('tanggal', now()->month)
                ->whereYear('tanggal', now()->year)
                ->sum('total');
            $totalProducts = Product::count();
            $totalCategories = Category::count();
            
            // Pengeluaran hari ini
            $todayExpenses = Expense::whereDate('tanggal', today())->sum('nominal');
            
            // Pengeluaran bulan ini
            $monthlyExpenses = Expense::whereMonth('tanggal', now()->month)
                ->whereYear('tanggal', now()->year)
                ->sum('nominal');
            
            // Pengeluaran 7 hari terakhir (untuk chart)
            $weeklyExpenses = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $expenses = Expense::whereDate('tanggal', $date)->sum('nominal');
                $weeklyExpenses[] = [
                    'tanggal' => $date->translatedFormat('d M'),
                    'total' => round((float) $expenses, 2),
                ];
            }
            
            // TAMBAHAN: Pengeluaran 12 bulan terakhir (untuk chart bulanan)
            $monthlyExpensesChart = [];
            $tahunIni = now()->year;
            $totalExpenseYear = 0;
            
            for ($bulan = 1; $bulan <= 12; $bulan++) {
                $date = Carbon::create($tahunIni, $bulan, 1);
                $startOfMonth = $date->copy()->startOfMonth();
                $endOfMonth = $date->copy()->endOfMonth();
                
                $expenses = Expense::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('nominal');
                $expensesRounded = round((float) $expenses, 2);
                
                $monthlyExpensesChart[] = [
                    'bulan' => $date->translatedFormat('F Y'),
                    'total' => $expensesRounded,
                ];
                
                $totalExpenseYear += $expensesRounded;
            }
            
            // Kategori pengeluaran terbanyak bulan ini
            $topExpenseCategories = Expense::whereMonth('tanggal', now()->month)
                ->whereYear('tanggal', now()->year)
                ->select('kategori_pengeluaran', DB::raw('SUM(nominal) as total'))
                ->groupBy('kategori_pengeluaran')
                ->orderBy('total', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($item) {
                    return [
                        'kategori_pengeluaran' => $item->kategori_pengeluaran,
                        'total' => round((float) $item->total, 2),
                    ];
                });
            
            // Grafik penjualan 7 hari terakhir
            $weeklySales = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i);
                $sales = Transaction::whereDate('tanggal', $date)->sum('total');
                $weeklySales[] = [
                    'tanggal' => $date->translatedFormat('d M'),
                    'total' => round((float) $sales, 2),
                ];
            }
            
            // Grafik penjualan bulanan - 12 BULAN DALAM TAHUN BERJALAN
            $monthlySalesChart = [];
            $tahunIni = now()->year;
            $totalSalesYear = 0;
            $bulanDenganPenjualan = 0;
            
            for ($bulan = 1; $bulan <= 12; $bulan++) {
                $date = Carbon::create($tahunIni, $bulan, 1);
                $startOfMonth = $date->copy()->startOfMonth();
                $endOfMonth = $date->copy()->endOfMonth();
                
                $sales = Transaction::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('total');
                $salesRounded = round((float) $sales, 2);
                
                $monthlySalesChart[] = [
                    'bulan' => $date->translatedFormat('F Y'),
                    'total' => $salesRounded,
                ];
                
                $totalSalesYear += $salesRounded;
                if ($salesRounded > 0) {
                    $bulanDenganPenjualan++;
                }
            }
            
            $rataRataBulanan = $bulanDenganPenjualan > 0 ? $totalSalesYear / $bulanDenganPenjualan : 0;
            
            // Transaksi terbaru
            $recentTransactions = Transaction::with('user')
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
                
        } else {
            // Cashier: hanya melihat transaksi sendiri
            $todaySales = Transaction::whereDate('tanggal', today())
                ->where('user_id', $user->id)
                ->sum('total');
            $todayTransactions = Transaction::whereDate('tanggal', today())
                ->where('user_id', $user->id)
                ->count();
            $totalProducts = Product::count();
            $totalCategories = Category::count();
            
            // Cashier tidak perlu data pengeluaran
            $todayExpenses = 0;
            $monthlyExpenses = 0;
            $weeklyExpenses = [];
            $monthlyExpensesChart = [];
            $topExpenseCategories = collect([]);
            $weeklySales = [];
            $monthlySalesChart = [];
            $monthlyStats = [
                'total_year' => 0,
                'average_monthly' => 0,
                'months_with_sales' => 0,
            ];
            
            $recentTransactions = Transaction::with('user')
                ->where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->limit(5)
                ->get();
        }
        
        // Pendapatan bersih hari ini
        $todayNetIncome = $todaySales - $todayExpenses;
        
        return Inertia::render('Dashboard', [
            'stats' => [
                'todaySales' => round((float) $todaySales, 2),
                'todayTransactions' => $todayTransactions,
                'monthlySales' => isset($monthlySales) ? round((float) $monthlySales, 2) : 0,
                'todayExpenses' => round((float) $todayExpenses, 2),
                'monthlyExpenses' => isset($monthlyExpenses) ? round((float) $monthlyExpenses, 2) : 0,
                'todayNetIncome' => round((float) $todayNetIncome, 2),
                'totalProducts' => $totalProducts,
                'totalCategories' => $totalCategories,
            ],
            'weeklySales' => $weeklySales,
            'weeklyExpenses' => $weeklyExpenses,
            'monthlySales' => $monthlySalesChart,
            'monthlyExpenses' => $monthlyExpensesChart, // TAMBAHKAN INI
            'monthlyStats' => $monthlyStats ?? [
                'total_year' => 0,
                'average_monthly' => 0,
                'months_with_sales' => 0,
            ],
            'topExpenseCategories' => $topExpenseCategories,
            'recentTransactions' => $recentTransactions,
        ]);
    }
    
    // API endpoint untuk refresh data
    public function refreshData()
    {
        $user = auth()->user();
        $isAdmin = $this->isAdmin();
        
        if ($isAdmin) {
            $todaySales = Transaction::whereDate('tanggal', today())->sum('total');
            $todayTransactions = Transaction::whereDate('tanggal', today())->count();
            $todayExpenses = Expense::whereDate('tanggal', today())->sum('nominal');
            $monthlyExpenses = Expense::whereMonth('tanggal', now()->month)
                ->whereYear('tanggal', now()->year)
                ->sum('nominal');
        } else {
            $todaySales = Transaction::whereDate('tanggal', today())
                ->where('user_id', $user->id)
                ->sum('total');
            $todayTransactions = Transaction::whereDate('tanggal', today())
                ->where('user_id', $user->id)
                ->count();
            $todayExpenses = 0;
            $monthlyExpenses = 0;
        }
        
        return response()->json([
            'todaySales' => round((float) $todaySales, 2),
            'todayTransactions' => $todayTransactions,
            'todayExpenses' => round((float) $todayExpenses, 2),
            'monthlyExpenses' => round((float) $monthlyExpenses, 2),
            'todayNetIncome' => round((float) ($todaySales - $todayExpenses), 2),
        ]);
    }
    
    // API endpoint untuk mendapatkan produk terlaris
    public function getPopularProducts()
    {
        try {
            $popularProducts = TransactionDetail::select(
                    'products.nama_produk as name',
                    'products.id as product_id',
                    DB::raw('SUM(transaction_details.jumlah) as total_sold'),
                    DB::raw('SUM(transaction_details.subtotal) as revenue')
                )
                ->join('products', 'transaction_details.product_id', '=', 'products.id')
                ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
                ->groupBy('products.id', 'products.nama_produk')
                ->orderBy('total_sold', 'desc')
                ->limit(10)
                ->get();
            
            if ($popularProducts->isEmpty()) {
                return response()->json([]);
            }
            
            $formattedProducts = $popularProducts->map(function ($item) {
                return [
                    'name' => $item->name,
                    'product_id' => $item->product_id,
                    'total_sold' => (int) $item->total_sold,
                    'revenue' => (float) $item->revenue,
                ];
            });
            
            return response()->json($formattedProducts);
        } catch (\Exception $e) {
            \Log::error('Error fetching popular products: ' . $e->getMessage());
            return response()->json([
                'error' => 'Gagal mengambil data produk terlaris',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}