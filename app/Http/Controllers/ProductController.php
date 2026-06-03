<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use App\Models\TransactionDetail; // TAMBAHKAN IMPORT INI
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    /**
     * Check if user is admin
     */
    protected function isAdmin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    /**
     * Check if user is admin or cashier
     */
    protected function isAdminOrCashier(): bool
    {
        return auth()->user() && (auth()->user()->isAdmin() || auth()->user()->isCashier());
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
     * Authorize view access (admin or cashier)
     */
    protected function authorizeView(): void
    {
        if (!$this->isAdminOrCashier()) {
            abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Validate store request
     */
    protected function validateStore(Request $request): array
    {
        return $request->validate([
            'kategori_id' => 'required|exists:categories,id',
            'nama_produk' => 'required|string|max:200|unique:products,nama_produk',
            'harga' => 'required|numeric|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'status' => 'boolean',
        ], [
            'kategori_id.required' => 'Kategori wajib dipilih',
            'nama_produk.required' => 'Nama produk wajib diisi',
            'nama_produk.unique' => 'Nama produk sudah ada',
            'harga.required' => 'Harga wajib diisi',
            'harga.min' => 'Harga minimal 0',
            'gambar.image' => 'File harus berupa gambar',
            'gambar.max' => 'Ukuran gambar maksimal 2MB',
        ]);
    }

    /**
     * Validate update request
     */
    protected function validateUpdate(Request $request, Product $product): array
    {
        return $request->validate([
            'kategori_id' => 'required|exists:categories,id',
            'nama_produk' => [
                'required',
                'string',
                'max:200',
                Rule::unique('products', 'nama_produk')->ignore($product->id)
            ],
            'harga' => 'required|numeric|min:0|max:999999999',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'status' => 'required|boolean',
        ], [
            'kategori_id.required' => 'Kategori produk wajib dipilih',
            'kategori_id.exists' => 'Kategori yang dipilih tidak valid',
            'nama_produk.required' => 'Nama produk wajib diisi',
            'nama_produk.string' => 'Nama produk harus berupa teks',
            'nama_produk.max' => 'Nama produk maksimal 200 karakter',
            'nama_produk.unique' => 'Nama produk sudah digunakan, silakan gunakan nama lain',
            'harga.required' => 'Harga produk wajib diisi',
            'harga.numeric' => 'Harga harus berupa angka',
            'harga.min' => 'Harga minimal 0',
            'harga.max' => 'Harga maksimal 999.999.999',
            'gambar.image' => 'File harus berupa gambar',
            'gambar.mimes' => 'Format gambar harus jpeg, png, jpg, gif, atau webp',
            'gambar.max' => 'Ukuran gambar maksimal 2MB',
            'status.required' => 'Status produk wajib dipilih',
            'status.boolean' => 'Status produk tidak valid',
        ]);
    }

    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        // Policy: HANYA ADMIN yang bisa melihat manajemen produk
        $this->authorizeAdmin(); // Ganti dari authorizeView ke authorizeAdmin
        
        // Get best selling product IDs
        $bestSellingIds = TransactionDetail::select('product_id', DB::raw('SUM(jumlah) as total_sold'))
            ->groupBy('product_id')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->pluck('product_id')
            ->toArray();

        $products = Product::with('kategori')
            ->search($request->search)
            ->filterByCategory($request->kategori_id)
            ->orderBy('created_at', 'desc')
            ->paginate(12)
            ->withQueryString();
        
        // Add is_best_seller attribute to each product
        $products->getCollection()->transform(function ($product) use ($bestSellingIds) {
            $product->is_best_seller = in_array($product->id, $bestSellingIds);
            return $product;
        });
        
        $categories = Category::all();
        
        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => $categories,
            'filters' => $request->only(['search', 'kategori_id']),
        ]);
    }
    
    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        // Policy: hanya admin yang bisa membuat
        $this->authorizeAdmin();

        $categories = Category::all();
        
        return Inertia::render('Products/Create', [
            'categories' => $categories,
        ]);
    }
    
    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        // Policy: hanya admin yang bisa membuat
        $this->authorizeAdmin();

        $data = $this->validateStore($request);
        
        // Handle status boolean
        $data['status'] = $request->status == '1' || $request->status == 1 || $request->status === true || $request->status === 'true';
        
        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('products', 'public');
        }
        
        // Set stok default 0 karena field stok di database required
        $data['stok'] = 0;
        
        Product::create($data);
        
        return redirect()->route('products.index')->with('success', 'Produk berhasil ditambahkan');
    }
    
    /**
     * Show the form for editing the specified product.
     */
    public function edit(Product $product)
    {
        // Policy: hanya admin yang bisa mengedit
        $this->authorizeAdmin();

        $categories = Category::all();
        
        return Inertia::render('Products/Edit', [
            'product' => $product,
            'categories' => $categories,
        ]);
    }
    
    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        // Policy: hanya admin yang bisa mengupdate
        $this->authorizeAdmin();

        $data = $this->validateUpdate($request, $product);
        
        // Handle status boolean
        $statusValue = $request->status;
        if ($statusValue === '0' || $statusValue === 0 || $statusValue === false || $statusValue === 'false') {
            $data['status'] = false;
        } else if ($statusValue === '1' || $statusValue === 1 || $statusValue === true || $statusValue === 'true') {
            $data['status'] = true;
        } else {
            $data['status'] = (bool) $statusValue;
        }
        
        // Handle gambar
        if ($request->hasFile('gambar')) {
            if ($product->gambar) {
                Storage::disk('public')->delete($product->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('products', 'public');
        } elseif ($request->input('remove_image') == '1') {
            if ($product->gambar) {
                Storage::disk('public')->delete($product->gambar);
            }
            $data['gambar'] = null;
        }
        
        $product->update($data);
        
        return redirect()->route('products.index')->with('success', 'Produk berhasil diupdate');
    }
    
    /**
     * Remove the specified product.
     */
    public function destroy(Product $product)
    {
        // Policy: hanya admin yang bisa menghapus
        $this->authorizeAdmin();

        if ($product->gambar) {
            Storage::disk('public')->delete($product->gambar);
        }
        
        $product->delete();
        
        return redirect()->back()->with('success', 'Produk berhasil dihapus');
    }
    
    /**
     * Remove product image.
     */
    public function removeImage(Product $product)
    {
        $this->authorizeAdmin();

        if ($product->gambar) {
            Storage::disk('public')->delete($product->gambar);
            $product->update(['gambar' => null]);
            
            return redirect()->back()->with('success', 'Gambar produk berhasil dihapus');
        }
        
        return redirect()->back()->with('error', 'Gambar tidak ditemukan');
    }

    /**
     * Get best selling products
     */
    public function getBestSellingProducts()
    {
        $bestSelling = TransactionDetail::select(
                'products.id',
                'products.nama_produk',
                DB::raw('SUM(transaction_details.jumlah) as total_sold')
            )
            ->join('products', 'transaction_details.product_id', '=', 'products.id')
            ->groupBy('products.id', 'products.nama_produk')
            ->orderBy('total_sold', 'desc')
            ->limit(5)
            ->get()
            ->pluck('id')
            ->toArray();
        
        return response()->json($bestSelling);
    }
}