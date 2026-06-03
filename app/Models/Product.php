<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $table = 'products';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'kategori_id',
        'nama_produk',
        'harga',
        'stok',
        'gambar',
        'status'
    ];
    
    protected $casts = [
        'status' => 'boolean',
        'harga' => 'decimal:2',
        'stok' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relasi ke Category
    public function kategori(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'kategori_id', 'id');
    }
    
    // Relasi ke TransactionDetail
    public function transactionDetails(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'product_id', 'id');
    }
    
    // Accessor untuk harga dengan format Rupiah
    public function getHargaFormattedAttribute()
    {
        return 'Rp ' . number_format($this->harga, 0, ',', '.');
    }
    
    // Accessor untuk status
    public function getStatusTextAttribute()
    {
        return $this->status ? 'Tersedia' : 'Tidak Tersedia';
    }
    
    // Scope untuk produk yang tersedia
    public function scopeAvailable($query)
    {
        return $query->where('status', true);
    }
    
    // Scope pencarian
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where('nama_produk', 'LIKE', "%{$search}%");
        }
        return $query;
    }
    
    // Scope filter by kategori
    public function scopeFilterByCategory($query, $categoryId)
    {
        if ($categoryId && $categoryId != 'all') {
            return $query->where('kategori_id', $categoryId);
        }
        return $query;
    }
}