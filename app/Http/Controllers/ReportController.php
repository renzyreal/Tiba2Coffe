<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use App\Exports\ReportExport;
use Maatwebsite\Excel\Facades\Excel;

class ReportController extends Controller
{
    protected function isAdmin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    protected function authorizeAdmin(): void
    {
        if (!$this->isAdmin()) {
            abort(403, 'Unauthorized action. Only admin can access reports.');
        }
    }

    /**
     * Display reports page.
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $period = $request->period ?? 'monthly';
        $startDate = $request->start_date;
        $endDate = $request->end_date;
        
        $dateRange = $this->getDateRangeFromPeriod($period, $startDate, $endDate);
        $start = $dateRange['start'];
        $end = $dateRange['end'];
        
        // Data untuk report
        $transactions = Transaction::whereBetween('tanggal', [$start, $end]);
        $totalTransactions = $transactions->count();
        $totalSales = $transactions->sum('total');
        
        $totalItemsSold = TransactionDetail::whereHas('transaction', function ($query) use ($start, $end) {
            $query->whereBetween('tanggal', [$start, $end]);
        })->sum('jumlah');
        
        $totalExpenses = Expense::whereBetween('tanggal', [$start, $end])->sum('nominal');
        $netIncome = $totalSales - $totalExpenses;
        
        $daysDiff = max(1, ceil((strtotime($end) - strtotime($start)) / (60 * 60 * 24)) + 1);
        $averageDailySales = $totalSales / $daysDiff;
        
        $dailySales = Transaction::select(
                DB::raw('DATE(tanggal) as date'),
                DB::raw('SUM(total) as total'),
                DB::raw('COUNT(*) as count')
            )
            ->whereBetween('tanggal', [$start, $end])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
        
        $salesChartData = $this->getSalesDataForPeriod($period, $start, $end);
        $expenseChartData = $this->getExpenseDataForPeriod($period, $start, $end);
        
        $topProducts = TransactionDetail::select(
                'product_id',
                DB::raw('SUM(jumlah) as total_terjual'),
                DB::raw('SUM(subtotal) as total_nominal')
            )
            ->with('product')
            ->whereHas('transaction', function ($query) use ($start, $end) {
                $query->whereBetween('tanggal', [$start, $end]);
            })
            ->groupBy('product_id')
            ->orderBy('total_terjual', 'desc')
            ->limit(10)
            ->get();
        
        $paymentMethods = Transaction::whereBetween('tanggal', [$start, $end])
            ->select('metode_pembayaran', DB::raw('COUNT(*) as total_transaksi'), DB::raw('SUM(total) as total_nominal'))
            ->groupBy('metode_pembayaran')
            ->get();
        
        $topCategories = TransactionDetail::select(
                'categories.nama_kategori',
                DB::raw('SUM(transaction_details.jumlah) as total_terjual'),
                DB::raw('SUM(transaction_details.subtotal) as total_nominal')
            )
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->join('categories', 'products.kategori_id', '=', 'categories.id')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.tanggal', [$start, $end])
            ->groupBy('categories.id', 'categories.nama_kategori')
            ->orderBy('total_terjual', 'desc')
            ->limit(5)
            ->get();
        
        $topExpenseCategories = Expense::whereBetween('tanggal', [$start, $end])
            ->select('kategori_pengeluaran', DB::raw('SUM(nominal) as total'))
            ->groupBy('kategori_pengeluaran')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();
        
        return Inertia::render('Reports/Index', [
            'reportData' => [
                'summary' => [
                    'total_transactions' => $totalTransactions,
                    'total_sales' => $totalSales,
                    'total_items_sold' => $totalItemsSold,
                    'total_expenses' => $totalExpenses,
                    'net_income' => $netIncome,
                    'average_daily_sales' => $averageDailySales,
                ],
                'daily_sales' => $dailySales,
                'sales_chart_data' => $salesChartData,
                'expense_chart_data' => $expenseChartData,
                'top_products' => $topProducts,
                'payment_methods' => $paymentMethods,
                'top_categories' => $topCategories,
                'top_expense_categories' => $topExpenseCategories,
                'date_range' => [
                    'start' => $start,
                    'end' => $end,
                    'days' => $daysDiff,
                ],
            ],
            'filters' => [
                'period' => $period,
                'start_date' => $start,
                'end_date' => $end,
            ],
        ]);
    }

    /**
     * Get date range based on period
     */
    protected function getDateRangeFromPeriod($period, $startDate = null, $endDate = null)
    {
        switch ($period) {
            case 'today':
                return ['start' => now()->format('Y-m-d'), 'end' => now()->format('Y-m-d')];
            case 'weekly':
                return ['start' => now()->startOfWeek()->format('Y-m-d'), 'end' => now()->endOfWeek()->format('Y-m-d')];
            case 'monthly':
                return ['start' => now()->startOfMonth()->format('Y-m-d'), 'end' => now()->endOfMonth()->format('Y-m-d')];
            case 'yearly':
                return ['start' => now()->startOfYear()->format('Y-m-d'), 'end' => now()->endOfYear()->format('Y-m-d')];
            case 'custom':
                return ['start' => $startDate, 'end' => $endDate];
            default:
                return ['start' => now()->startOfMonth()->format('Y-m-d'), 'end' => now()->endOfMonth()->format('Y-m-d')];
        }
    }

    /**
     * Get sales data for chart
     */
    protected function getSalesDataForPeriod($period, $start, $end)
    {
        if ($period === 'yearly') {
            $data = [];
            $tahunIni = now()->year;
            for ($bulan = 1; $bulan <= 12; $bulan++) {
                $date = Carbon::create($tahunIni, $bulan, 1);
                $sales = Transaction::whereYear('tanggal', $tahunIni)->whereMonth('tanggal', $bulan)->sum('total');
                $data[] = ['bulan' => $date->translatedFormat('F'), 'total' => round((float) $sales, 2)];
            }
            return $data;
        } else {
            $data = [];
            $currentDate = Carbon::parse($start);
            $endDate = Carbon::parse($end);
            while ($currentDate <= $endDate) {
                $sales = Transaction::whereDate('tanggal', $currentDate)->sum('total');
                $data[] = ['tanggal' => $currentDate->translatedFormat('d M'), 'total' => round((float) $sales, 2)];
                $currentDate->addDay();
            }
            return $data;
        }
    }

    /**
     * Get expense data for chart
     */
    protected function getExpenseDataForPeriod($period, $start, $end)
    {
        if ($period === 'yearly') {
            $data = [];
            $tahunIni = now()->year;
            for ($bulan = 1; $bulan <= 12; $bulan++) {
                $date = Carbon::create($tahunIni, $bulan, 1);
                $expenses = Expense::whereYear('tanggal', $tahunIni)->whereMonth('tanggal', $bulan)->sum('nominal');
                $data[] = ['bulan' => $date->translatedFormat('F'), 'total' => round((float) $expenses, 2)];
            }
            return $data;
        } else {
            $data = [];
            $currentDate = Carbon::parse($start);
            $endDate = Carbon::parse($end);
            while ($currentDate <= $endDate) {
                $expenses = Expense::whereDate('tanggal', $currentDate)->sum('nominal');
                $data[] = ['tanggal' => $currentDate->translatedFormat('d M'), 'total' => round((float) $expenses, 2)];
                $currentDate->addDay();
            }
            return $data;
        }
    }

    /**
     * Export report to Excel or PDF
     */
    public function export(Request $request)
    {
        $this->authorizeAdmin();
        
        $format = $request->format ?? 'pdf';
        $startDate = $request->start_date ?? now()->startOfMonth()->format('Y-m-d');
        $endDate = $request->end_date ?? now()->endOfMonth()->format('Y-m-d');
        
        $data = [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'generated_at' => now()->format('d/m/Y H:i:s'),
            'generated_by' => auth()->user()->name,
        ];
        
        // Summary
        $transactions = Transaction::whereBetween('tanggal', [$startDate, $endDate]);
        $data['total_transactions'] = $transactions->count();
        $data['total_sales'] = $transactions->sum('total');
        $data['total_expenses'] = Expense::whereBetween('tanggal', [$startDate, $endDate])->sum('nominal');
        $data['total_expense_transactions'] = Expense::whereBetween('tanggal', [$startDate, $endDate])->count(); // TAMBAHAN
        $data['net_income'] = $data['total_sales'] - $data['total_expenses'];
        
        // Top products
        $data['top_products'] = TransactionDetail::select(
                'products.nama_produk',
                DB::raw('SUM(transaction_details.jumlah) as total_terjual'),
                DB::raw('SUM(transaction_details.subtotal) as total_nominal')
            )
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.tanggal', [$startDate, $endDate])
            ->groupBy('products.id', 'products.nama_produk')
            ->orderBy('total_terjual', 'desc')
            ->limit(10)
            ->get();
        
        // Daily sales
        $data['daily_sales'] = Transaction::select(
                DB::raw('DATE(tanggal) as tanggal'),
                DB::raw('COUNT(*) as jumlah_transaksi'),
                DB::raw('SUM(total) as total_penjualan')
            )
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->groupBy('tanggal')
            ->orderBy('tanggal')
            ->get();
        
        // Payment methods
        $data['payment_methods'] = Transaction::whereBetween('tanggal', [$startDate, $endDate])
            ->select('metode_pembayaran', DB::raw('COUNT(*) as jumlah'), DB::raw('SUM(total) as total'))
            ->groupBy('metode_pembayaran')
            ->get();
        
        $data['metode_labels'] = [
            'tunai' => 'Tunai',
            'qris' => 'QRIS',
            'transfer_bank' => 'Transfer Bank'
        ];
        
        // Data tutup kas
        $data['cash_closings'] = \App\Models\CashClosing::with('user')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        if ($format === 'excel' || $format === 'csv') {
            $export = new ReportExport($startDate, $endDate, $data);
            $extension = $format === 'excel' ? 'xlsx' : 'csv';
            $filename = "laporan_penjualan_{$startDate}_sd_{$endDate}.{$extension}";
            
            if ($format === 'csv') {
                return Excel::download($export, $filename, \Maatwebsite\Excel\Excel::CSV);
            }
            return Excel::download($export, $filename);
        } else {
            $pdf = Pdf::loadView('reports.export-pdf', $data);
            $filename = "laporan_penjualan_{$startDate}_sd_{$endDate}.pdf";
            return $pdf->download($filename);
        }
    }
}