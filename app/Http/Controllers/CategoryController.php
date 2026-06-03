<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Check if user is admin (Policy replacement)
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
     * Validate store request
     */
    protected function validateStore(Request $request): array
    {
        return $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:categories,nama_kategori',
            'deskripsi' => 'nullable|string|max:500',
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi',
            'nama_kategori.unique' => 'Nama kategori sudah digunakan',
            'nama_kategori.max' => 'Nama kategori maksimal 100 karakter',
        ]);
    }

    /**
     * Validate update request
     */
    protected function validateUpdate(Request $request, Category $category): array
    {
        return $request->validate([
            'nama_kategori' => [
                'required',
                'string',
                'max:100',
                Rule::unique('categories', 'nama_kategori')->ignore($category->id)
            ],
            'deskripsi' => 'nullable|string|max:500',
        ], [
            'nama_kategori.required' => 'Nama kategori wajib diisi',
            'nama_kategori.unique' => 'Nama kategori sudah digunakan, silakan gunakan nama lain',
            'nama_kategori.max' => 'Nama kategori maksimal 100 karakter',
            'deskripsi.max' => 'Deskripsi maksimal 500 karakter',
        ]);
    }

    /**
     * Display a listing of the categories.
     */
    public function index(Request $request)
    {
        // Policy: hanya admin yang bisa melihat
        $this->authorizeAdmin();

        $categories = Category::search($request->search)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }
    
    /**
     * Store a newly created category.
     */
    public function store(Request $request)
    {
        // Policy: hanya admin yang bisa membuat
        $this->authorizeAdmin();

        // Validasi request
        $validated = $this->validateStore($request);
        
        Category::create($validated);
        
        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan');
    }
    
    /**
     * Update the specified category.
     */
    public function update(Request $request, Category $category)
    {
        // Policy: hanya admin yang bisa mengupdate
        $this->authorizeAdmin();

        // Validasi request
        $validated = $this->validateUpdate($request, $category);
        
        $category->update($validated);
        
        return redirect()->back()->with('success', 'Kategori berhasil diupdate');
    }
    
    /**
     * Remove the specified category.
     */
    public function destroy(Category $category)
    {
        // Policy: hanya admin yang bisa menghapus
        $this->authorizeAdmin();

        // Cek apakah kategori memiliki produk
        if ($category->products()->count() > 0) {
            return redirect()->back()->with('error', 'Kategori tidak bisa dihapus karena masih memiliki produk');
        }
        
        $category->delete();
        
        return redirect()->back()->with('success', 'Kategori berhasil dihapus');
    }
    
    /**
     * Get all categories (for API/JSON response).
     */
    public function getAll()
    {
        // Policy: hanya admin yang bisa melihat semua kategori
        $this->authorizeAdmin();
        
        return response()->json(Category::all());
    }
}