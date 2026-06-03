<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
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
            abort(403, 'Unauthorized action. Only admin can manage expenses.');
        }
    }

    /**
     * Validate expense request
     */
    protected function validateExpense(Request $request, $isUpdate = false, $expense = null): array
    {
        $rules = [
            'tanggal' => 'required|date|before_or_equal:today',
            'kategori_pengeluaran' => 'required|string|max:100',
            'nominal' => 'required|numeric|min:0|max:999999999',
            'keterangan' => 'nullable|string|max:500',
        ];

        $messages = [
            'tanggal.required' => 'Tanggal pengeluaran wajib diisi',
            'tanggal.date' => 'Format tanggal tidak valid',
            'tanggal.before_or_equal' => 'Tanggal tidak boleh melebihi hari ini',
            'kategori_pengeluaran.required' => 'Kategori pengeluaran wajib diisi',
            'kategori_pengeluaran.max' => 'Kategori pengeluaran maksimal 100 karakter',
            'nominal.required' => 'Nominal pengeluaran wajib diisi',
            'nominal.numeric' => 'Nominal harus berupa angka',
            'nominal.min' => 'Nominal minimal 0',
            'nominal.max' => 'Nominal maksimal Rp 999.999.999',
            'keterangan.max' => 'Keterangan maksimal 500 karakter',
        ];

        return $request->validate($rules, $messages);
    }

    /**
     * Get expense data for create/update
     */
    protected function getExpenseData(Request $request): array
    {
        return [
            'tanggal' => $request->tanggal ?: date('Y-m-d'),
            'kategori_pengeluaran' => $request->kategori_pengeluaran,
            'nominal' => $request->nominal,
            'keterangan' => $request->keterangan,
            'user_id' => auth()->id(),
        ];
    }

    /**
     * Display a listing of expenses.
     */
    public function index(Request $request)
    {
        // Policy: hanya admin yang bisa melihat pengeluaran
        $this->authorizeAdmin();

        $query = Expense::with('user');

        // Filter by date range
        if ($request->start_date) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }

        // Filter by kategori
        if ($request->kategori) {
            $query->where('kategori_pengeluaran', $request->kategori);
        }

        // Search by keterangan
        if ($request->search) {
            $query->where('keterangan', 'LIKE', "%{$request->search}%");
        }

        $expenses = $query->orderBy('tanggal', 'desc')
            ->paginate(15)
            ->withQueryString();

        // Calculate total expense based on filters
        $totalQuery = Expense::query();
        if ($request->start_date) {
            $totalQuery->whereDate('tanggal', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $totalQuery->whereDate('tanggal', '<=', $request->end_date);
        }
        if ($request->kategori) {
            $totalQuery->where('kategori_pengeluaran', $request->kategori);
        }
        if ($request->search) {
            $totalQuery->where('keterangan', 'LIKE', "%{$request->search}%");
        }
        $totalExpense = $totalQuery->sum('nominal');

        // Get expense summary by category
        $categorySummary = Expense::select('kategori_pengeluaran', \DB::raw('SUM(nominal) as total'))
            ->when($request->start_date, function ($query) use ($request) {
                return $query->whereDate('tanggal', '>=', $request->start_date);
            })
            ->when($request->end_date, function ($query) use ($request) {
                return $query->whereDate('tanggal', '<=', $request->end_date);
            })
            ->groupBy('kategori_pengeluaran')
            ->orderBy('total', 'desc')
            ->get();

        // Get unique categories for filter dropdown
        $categories = Expense::select('kategori_pengeluaran')
            ->distinct()
            ->pluck('kategori_pengeluaran')
            ->toArray();

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'totalExpense' => $totalExpense,
            'categorySummary' => $categorySummary,
            'filters' => $request->only(['start_date', 'end_date', 'kategori']),
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created expense.
     */
    public function store(Request $request)
    {
        // Policy: hanya admin yang bisa mencatat pengeluaran
        $this->authorizeAdmin();

        // Validate request
        $this->validateExpense($request);

        // Create expense
        Expense::create($this->getExpenseData($request));

        return redirect()->back()->with('success', 'Pengeluaran berhasil dicatat');
    }

    /**
     * Update the specified expense.
     */
    public function update(Request $request, Expense $expense)
    {
        // Policy: hanya admin yang bisa mengupdate pengeluaran
        $this->authorizeAdmin();

        // Validate request
        $this->validateExpense($request, true, $expense);

        // Update expense
        $expense->update($this->getExpenseData($request));

        return redirect()->back()->with('success', 'Pengeluaran berhasil diupdate');
    }

    /**
     * Remove the specified expense.
     */
    public function destroy(Expense $expense)
    {
        // Policy: hanya admin yang bisa menghapus pengeluaran
        $this->authorizeAdmin();

        // Delete expense
        $expense->delete();

        return redirect()->back()->with('success', 'Pengeluaran berhasil dihapus');
    }

    /**
     * Get expense report for a date range.
     */
    public function report(Request $request)
    {
        // Policy: hanya admin yang bisa melihat laporan
        $this->authorizeAdmin();

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ], [
            'start_date.required' => 'Tanggal mulai wajib diisi',
            'end_date.required' => 'Tanggal akhir wajib diisi',
            'end_date.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai',
        ]);

        $startDate = $request->start_date;
        $endDate = $request->end_date;

        $expenses = Expense::with('user')
            ->whereBetween('tanggal', [$startDate, $endDate])
            ->orderBy('tanggal', 'desc')
            ->get();

        $summary = [
            'total_expense' => $expenses->sum('nominal'),
            'total_transactions' => $expenses->count(),
            'average_per_day' => $expenses->sum('nominal') / max(1, $expenses->groupBy('tanggal')->count()),
            'categories' => $expenses->groupBy('kategori_pengeluaran')->map(function ($group) {
                return [
                    'total' => $group->sum('nominal'),
                    'count' => $group->count(),
                    'percentage' => 0,
                ];
            }),
        ];

        // Calculate percentages
        if ($summary['total_expense'] > 0) {
            foreach ($summary['categories'] as $category => &$data) {
                $data['percentage'] = round(($data['total'] / $summary['total_expense']) * 100, 2);
            }
        }

        return Inertia::render('Expenses/Report', [
            'expenses' => $expenses,
            'summary' => $summary,
            'date_range' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
        ]);
    }

    /**
     * Get expense categories list.
     */
    public function categories()
    {
        // Policy: hanya admin yang bisa melihat kategori
        $this->authorizeAdmin();

        $categories = Expense::select('kategori_pengeluaran')
            ->distinct()
            ->orderBy('kategori_pengeluaran')
            ->pluck('kategori_pengeluaran');

        return response()->json($categories);
    }

    /**
     * Get expense statistics.
     */
    public function statistics(Request $request)
    {
        // Policy: hanya admin yang bisa melihat statistik
        $this->authorizeAdmin();

        $period = $request->period ?? 'month';

        switch ($period) {
            case 'week':
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfWeek();
                break;
            case 'month':
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
                break;
            case 'year':
                $startDate = now()->startOfYear();
                $endDate = now()->endOfYear();
                break;
            default:
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
        }

        $expenses = Expense::whereBetween('tanggal', [$startDate, $endDate])->get();

        $statistics = [
            'period' => $period,
            'start_date' => $startDate->format('Y-m-d'),
            'end_date' => $endDate->format('Y-m-d'),
            'total_expense' => $expenses->sum('nominal'),
            'total_transactions' => $expenses->count(),
            'highest_expense' => $expenses->max('nominal'),
            'average_expense' => $expenses->avg('nominal'),
            'daily_average' => $expenses->sum('nominal') / max(1, $expenses->groupBy('tanggal')->count()),
            'top_category' => $expenses->groupBy('kategori_pengeluaran')
                ->map(function ($group) {
                    return $group->sum('nominal');
                })
                ->sortDesc()
                ->first(),
            'expenses_by_category' => $expenses->groupBy('kategori_pengeluaran')
                ->map(function ($group) {
                    return [
                        'total' => $group->sum('nominal'),
                        'count' => $group->count(),
                    ];
                }),
            'expenses_by_day' => $expenses->groupBy(function ($expense) {
                return $expense->tanggal->format('Y-m-d');
            })->map(function ($group) {
                return $group->sum('nominal');
            }),
        ];

        return response()->json($statistics);
    }

    /**
     * Bulk delete expenses.
     */
    public function bulkDelete(Request $request)
    {
        // Policy: hanya admin yang bisa bulk delete
        $this->authorizeAdmin();

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:expenses,id',
        ], [
            'ids.required' => 'Pilih pengeluaran yang akan dihapus',
            'ids.array' => 'Format data tidak valid',
            'ids.*.exists' => 'Beberapa pengeluaran tidak ditemukan',
        ]);

        $deletedCount = Expense::whereIn('id', $request->ids)->delete();

        return redirect()->back()->with('success', "{$deletedCount} pengeluaran berhasil dihapus");
    }

    /**
     * Get expense summary for dashboard.
     */
    public function dashboardSummary()
    {
        // Policy: hanya admin yang bisa melihat summary dashboard
        $this->authorizeAdmin();

        $today = now()->format('Y-m-d');
        
        $todayExpense = Expense::whereDate('tanggal', $today)->sum('nominal');
        $monthlyExpense = Expense::whereYear('tanggal', now()->year)
            ->whereMonth('tanggal', now()->month)
            ->sum('nominal');
        $yearlyExpense = Expense::whereYear('tanggal', now()->year)->sum('nominal');

        // Compare with previous month
        $lastMonthExpense = Expense::whereYear('tanggal', now()->subMonth()->year)
            ->whereMonth('tanggal', now()->subMonth()->month)
            ->sum('nominal');

        $monthlyChange = $lastMonthExpense > 0 
            ? (($monthlyExpense - $lastMonthExpense) / $lastMonthExpense) * 100 
            : 0;

        // Top expense categories this month
        $topCategories = Expense::select('kategori_pengeluaran', \DB::raw('SUM(nominal) as total'))
            ->whereYear('tanggal', now()->year)
            ->whereMonth('tanggal', now()->month)
            ->groupBy('kategori_pengeluaran')
            ->orderBy('total', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'today' => $todayExpense,
            'monthly' => $monthlyExpense,
            'yearly' => $yearlyExpense,
            'monthly_change' => round($monthlyChange, 2),
            'top_categories' => $topCategories,
            'last_month' => $lastMonthExpense,
        ]);
    }
}