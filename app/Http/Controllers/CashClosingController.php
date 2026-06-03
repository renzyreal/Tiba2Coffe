<?php

namespace App\Http\Controllers;

use App\Models\CashClosing;
use App\Models\Transaction;
use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class CashClosingController extends Controller
{
    /**
     * Check if user is admin
     */
    protected function isAdmin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    /**
     * Authorize admin action
     */
    protected function authorizeAdmin(): void
    {
        if (!$this->isAdmin()) {
            abort(403, 'Unauthorized action. Only admin can access this resource.');
        }
    }

    /**
     * Display cash closing page.
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $date = $request->date ?? now()->format('Y-m-d');
        
        // Cek apakah sudah ditutup
        $existingClosing = CashClosing::where('tanggal', $date)->first();
        
        // Get data transaksi dan pengeluaran
        $todayTransactions = Transaction::whereDate('tanggal', $date);
        $totalPenjualan = $todayTransactions->sum('total') ?? 0;
        $totalTransaksi = $todayTransactions->count() ?? 0;
        
        $totalPengeluaran = Expense::whereDate('tanggal', $date)->sum('nominal') ?? 0;
        $pendapatanBersih = $totalPenjualan - $totalPengeluaran;
        
        // Recent closings
        $recentClosings = CashClosing::with('user')
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        $transactions = Transaction::whereDate('tanggal', $date)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $expenses = Expense::whereDate('tanggal', $date)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('CashClosing/Index', [
            'date' => $date,
            'isClosed' => !is_null($existingClosing),
            'existingClosing' => $existingClosing,
            'data' => [
                'total_penjualan' => (float) $totalPenjualan,
                'total_transaksi' => (int) $totalTransaksi,
                'total_pengeluaran' => (float) $totalPengeluaran,
                'pendapatan_bersih' => (float) $pendapatanBersih,
            ],
            'transactions' => $transactions,
            'expenses' => $expenses,
            'recent_closings' => $recentClosings,
        ]);
    }

    /**
     * Store cash closing.
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'tanggal' => 'required|date|unique:cash_closings,tanggal',
            'total_penjualan' => 'required|numeric|min:0',
            'total_transaksi' => 'required|integer|min:0',
            'total_pengeluaran' => 'required|numeric|min:0',
            'pendapatan_bersih' => 'nullable|numeric',
        ]);
        
        $pendapatanBersih = $validated['total_penjualan'] - $validated['total_pengeluaran'];
        $validated['pendapatan_bersih'] = $pendapatanBersih;
        
        DB::beginTransaction();
        
        try {
            $closing = CashClosing::create([
                'tanggal' => $validated['tanggal'],
                'total_penjualan' => $validated['total_penjualan'],
                'total_transaksi' => $validated['total_transaksi'],
                'total_pengeluaran' => $validated['total_pengeluaran'],
                'pendapatan_bersih' => $validated['pendapatan_bersih'],
                'user_id' => auth()->id(),
            ]);
            
            DB::commit();
            
            return redirect()->route('cash-closing.index', ['date' => $validated['tanggal']])
                ->with('success', 'Tutup kas berhasil dilakukan');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Update cash closing (untuk hari yang sama)
     */
    public function update(Request $request, $id)
    {
        $this->authorizeAdmin();
        
        // Cari cash closing berdasarkan ID
        $cashClosing = CashClosing::findOrFail($id);
        
        // Ambil tanggal dari cash closing dan hari ini dengan format yang sama
        $closingDate = $cashClosing->tanggal instanceof \Carbon\Carbon 
            ? $cashClosing->tanggal->toDateString() 
            : date('Y-m-d', strtotime($cashClosing->tanggal));
        
        $today = now()->toDateString();
        
        // Debug log (hapus setelah selesai)
        \Log::info('Update Cash Closing', [
            'closing_id' => $id,
            'closing_date' => $closingDate,
            'today' => $today,
            'closing_raw' => $cashClosing->tanggal
        ]);
        
        // Hanya bisa update jika tanggalnya hari ini
        if ($closingDate !== $today) {
            return redirect()->back()
                ->with('error', 'Tidak dapat mengupdate tutup kas untuk tanggal yang sudah lewat. (Closing: ' . $closingDate . ', Today: ' . $today . ')');
        }
        
        // Validasi request
        $validated = $request->validate([
            'total_penjualan' => 'required|numeric|min:0',
            'total_transaksi' => 'required|integer|min:0',
            'total_pengeluaran' => 'required|numeric|min:0',
            'pendapatan_bersih' => 'nullable|numeric',
        ]);
        
        // Hitung pendapatan bersih
        $pendapatanBersih = $validated['total_penjualan'] - $validated['total_pengeluaran'];
        $validated['pendapatan_bersih'] = $pendapatanBersih;
        
        // Update data
        $cashClosing->update([
            'total_penjualan' => $validated['total_penjualan'],
            'total_transaksi' => $validated['total_transaksi'],
            'total_pengeluaran' => $validated['total_pengeluaran'],
            'pendapatan_bersih' => $validated['pendapatan_bersih'],
        ]);
        
        // Redirect dengan flash message (bukan JSON response)
        return redirect()->route('cash-closing.index', ['date' => $cashClosing->tanggal])
            ->with('success', 'Tutup kas berhasil diupdate');
    }

    /**
     * Show cash closing detail.
     */
    public function show(CashClosing $cashClosing)
    {
        $this->authorizeAdmin();
        $cashClosing->load('user');
        
        $transactions = Transaction::whereDate('tanggal', $cashClosing->tanggal)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(15);
        
        $expenses = Expense::whereDate('tanggal', $cashClosing->tanggal)
            ->orderBy('created_at', 'desc')
            ->get();
        
        $paymentBreakdown = Transaction::whereDate('tanggal', $cashClosing->tanggal)
            ->select('metode_pembayaran', DB::raw('COUNT(*) as jumlah'), DB::raw('SUM(total) as total'))
            ->groupBy('metode_pembayaran')
            ->get();
        
        return Inertia::render('CashClosing/Show', [
            'closing' => $cashClosing,
            'transactions' => $transactions,
            'expenses' => $expenses,
            'payment_breakdown' => $paymentBreakdown,
        ]);
    }

    /**
     * Get closing summary for a date range.
     */
    public function summary(Request $request)
    {
        $this->authorizeAdmin();
        
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);
        
        $closings = CashClosing::whereBetween('tanggal', [$request->start_date, $request->end_date])->get();
        
        return response()->json([
            'total_penjualan' => $closings->sum('total_penjualan'),
            'total_transaksi' => $closings->sum('total_transaksi'),
            'total_pengeluaran' => $closings->sum('total_pengeluaran'),
            'total_pendapatan_bersih' => $closings->sum('pendapatan_bersih'),
            'average_daily_sales' => $closings->avg('total_penjualan') ?? 0,
            'total_closings' => $closings->count(),
        ]);
    }

    /**
     * Print cash closing report.
     */
    public function print(CashClosing $cashClosing)
    {
        $this->authorizeAdmin();
        $cashClosing->load('user');
        
        $transactions = Transaction::whereDate('tanggal', $cashClosing->tanggal)->get();
        $expenses = Expense::whereDate('tanggal', $cashClosing->tanggal)->get();
        
        $pdf = Pdf::loadView('prints.cash-closing', [
            'closing' => $cashClosing,
            'transactions' => $transactions,
            'expenses' => $expenses,
        ]);
        
        return $pdf->download('tutup_kas_' . $cashClosing->tanggal . '.pdf');
    }

    /**
     * Check if cash closing exists for a date.
     */
    public function check($date)
    {
        $this->authorizeAdmin();
        
        $exists = CashClosing::where('tanggal', $date)->exists();
        $closing = CashClosing::where('tanggal', $date)->first();
        
        return response()->json([
            'exists' => $exists,
            'closing' => $closing,
        ]);
    }

    /**
     * Get dashboard summary.
     */
    public function dashboardSummary()
    {
        $this->authorizeAdmin();
        
        $today = now()->format('Y-m-d');
        $todayClosing = CashClosing::whereDate('tanggal', $today)->first();
        
        $monthlyClosings = CashClosing::whereYear('tanggal', now()->year)
            ->whereMonth('tanggal', now()->month)
            ->get();
        
        $yearlyClosings = CashClosing::whereYear('tanggal', now()->year)->get();
        
        return response()->json([
            'today' => $todayClosing,
            'monthly' => [
                'total_penjualan' => $monthlyClosings->sum('total_penjualan'),
                'total_pendapatan_bersih' => $monthlyClosings->sum('pendapatan_bersih'),
                'total_transaksi' => $monthlyClosings->sum('total_transaksi'),
            ],
            'yearly' => [
                'total_penjualan' => $yearlyClosings->sum('total_penjualan'),
                'total_pendapatan_bersih' => $yearlyClosings->sum('pendapatan_bersih'),
                'total_transaksi' => $yearlyClosings->sum('total_transaksi'),
            ],
        ]);
    }

    /**
     * Get cash closing history.
     */
    public function history(Request $request)
    {
        $this->authorizeAdmin();
        
        $closings = CashClosing::with('user')
            ->orderBy('tanggal', 'desc')
            ->paginate(20)
            ->withQueryString();
        
        return Inertia::render('CashClosing/History', [
            'closings' => $closings,
        ]);
    }

    /**
     * Export cash closing to CSV.
     */
    public function export(Request $request)
    {
        $this->authorizeAdmin();
        
        $startDate = $request->start_date ?? now()->startOfMonth();
        $endDate = $request->end_date ?? now()->endOfMonth();
        
        $closings = CashClosing::whereBetween('tanggal', [$startDate, $endDate])
            ->with('user')
            ->get();
        
        $filename = 'tutup_kas_' . $startDate . '_sd_' . $endDate . '.csv';
        
        $handle = fopen('php://temp', 'w+');
        
        fputcsv($handle, [
            'Tanggal',
            'Total Penjualan',
            'Total Transaksi',
            'Total Pengeluaran',
            'Pendapatan Bersih',
            'Ditutup Oleh',
            'Waktu Tutup'
        ]);
        
        foreach ($closings as $closing) {
            fputcsv($handle, [
                $closing->tanggal,
                $closing->total_penjualan,
                $closing->total_transaksi,
                $closing->total_pengeluaran,
                $closing->pendapatan_bersih,
                $closing->user->name ?? 'System',
                $closing->created_at->format('Y-m-d H:i:s')
            ]);
        }
        
        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);
        
        return response($csv, 200)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
}