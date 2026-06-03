<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class TransactionController extends Controller
{
    protected function isAdmin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    protected function isAdminOrCashier(): bool
    {
        return auth()->user() && (auth()->user()->isAdmin() || auth()->user()->isCashier());
    }

    protected function authorizeView(): void
    {
        if (!$this->isAdminOrCashier()) {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Display POS page
     */
    public function pos()
    {
        $this->authorizeView();

        // Get ALL products with kategori (termasuk yang tidak aktif)
        $allProducts = Product::with('kategori')
            ->get(); // Hapus where('status', true)
        
        // Get best selling products per category
        $bestSellingPerCategory = TransactionDetail::select(
                'products.kategori_id',
                'products.id',
                'products.nama_produk',
                'products.harga',
                'products.gambar',
                DB::raw('SUM(transaction_details.jumlah) as total_sold')
            )
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->join('transactions', 'transaction_details.transaction_id', '=', 'transactions.id')
            ->groupBy('products.id', 'products.kategori_id', 'products.nama_produk', 'products.harga', 'products.gambar')
            ->orderBy('total_sold', 'desc')
            ->get();
        
        // Group best selling by category
        $bestSellingGrouped = [];
        foreach ($bestSellingPerCategory as $item) {
            $categoryId = $item->kategori_id;
            if (!isset($bestSellingGrouped[$categoryId])) {
                $bestSellingGrouped[$categoryId] = [];
            }
            if (count($bestSellingGrouped[$categoryId]) < 3) {
                $bestSellingGrouped[$categoryId][] = $item->id;
            }
        }
        
        // Mark products as best seller and sort
        $products = $allProducts->map(function ($product) use ($bestSellingGrouped) {
            $categoryId = $product->kategori_id;
            $isBestSeller = isset($bestSellingGrouped[$categoryId]) && in_array($product->id, $bestSellingGrouped[$categoryId]);
            $product->is_best_seller = $isBestSeller;
            return $product;
        });
        
        // Sort products: best seller first, then active first, then alphabetically
        $products = $products->sortByDesc(function ($product) {
            // Prioritaskan best seller (2), lalu aktif (1), lalu nonaktif (0)
            $priority = 0;
            if ($product->is_best_seller) $priority = 2;
            else if ($product->status) $priority = 1;
            return $priority;
        })->values();
        
        return Inertia::render('POS/Index', [
            'products' => $products,
        ]);
    }
    
    /**
     * Store a new transaction
     */
    public function store(Request $request)
    {
        $this->authorizeView();
        
        // Validasi - Atas Nama WAJIB diisi
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.jumlah' => 'required|integer|min:1',
            'items.*.harga' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'bayar' => 'required|numeric|min:0',
            'metode_pembayaran' => 'required|in:tunai,qris,transfer_bank',
            'atas_nama' => 'required|string|max:255', // DIUBAH JADI REQUIRED
            'catatan' => 'nullable|string|max:500',
        ], [
            'atas_nama.required' => 'Atas nama wajib diisi', // Pesan error custom
        ]);
        
        DB::beginTransaction();
        
        try {
            $kembalian = $request->bayar - $request->total;
            
            // Generate nomor transaksi
            $today = date('Ymd');
            $lastTransaction = Transaction::whereDate('created_at', today())->orderBy('id', 'desc')->first();
            $lastNumber = $lastTransaction ? intval(substr($lastTransaction->no_transaksi, -4)) : 0;
            $no_transaksi = 'TRX-' . $today . '-' . str_pad($lastNumber + 1, 4, '0', STR_PAD_LEFT);
            
            // Simpan transaksi
            $transaction = Transaction::create([
                'no_transaksi' => $no_transaksi,
                'user_id' => auth()->id(),
                'atas_nama' => $request->atas_nama,
                'subtotal' => $request->total,
                'diskon' => 0,
                'total' => $request->total,
                'bayar' => $request->bayar,
                'kembalian' => $kembalian,
                'metode_pembayaran' => $request->metode_pembayaran,
                'catatan' => $request->catatan,
                'tanggal' => now(),
            ]);
            
            // Simpan detail transaksi
            foreach ($request->items as $item) {
                TransactionDetail::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'jumlah' => $item['jumlah'],
                    'harga' => $item['harga'],
                    'subtotal' => $item['harga'] * $item['jumlah'],
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'transaction_id' => $transaction->id,
                'transaction_no' => $no_transaksi
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display list of transactions
     */
    public function index(Request $request)
    {
        $this->authorizeView();

        $query = Transaction::with('user');
        
        if ($request->start_date) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        }
        if ($request->end_date) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }
        
        if (!$this->isAdmin()) {
            $query->where('user_id', auth()->id());
        }
        
        $transactions = $query->orderBy('created_at', 'desc')->paginate(15);
        
        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['start_date', 'end_date']),
        ]);
    }
    
    /**
     * Display single transaction
     */
    public function show($id)
    {
        $transaction = Transaction::with(['user', 'details.product'])->findOrFail($id);
        
        // Policy: admin bisa lihat semua, kasir hanya transaksi sendiri
        if (!$this->isAdmin() && auth()->id() !== $transaction->user_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }
        
        // Jika request dari Inertia (bukan AJAX), return Inertia render
        if (!request()->wantsJson()) {
            return Inertia::render('Transactions/Show', [
                'transaction' => $transaction,
            ]);
        }
        
        // Jika request AJAX/JSON, return JSON
        return response()->json($transaction);
    }
    
    /**
     * Print transaction receipt
     */
    public function print($id)
    {
        $transaction = Transaction::with(['details.product', 'user'])->findOrFail($id);
        
        if (!$this->isAdmin() && auth()->id() !== $transaction->user_id) {
            abort(403);
        }
        
        $pdf = Pdf::loadView('prints.struk', ['transaction' => $transaction]);
        $pdf->setPaper([0, 0, 226.77, 500], 'portrait');
        
        return $pdf->stream('struk-' . ($transaction->no_transaksi ?? $transaction->id) . '.pdf');
    }
}