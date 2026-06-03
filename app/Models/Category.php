<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $table = 'categories';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'nama_kategori',
        'deskripsi'
    ];
    
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relasi ke Product
    public function products(): HasMany
    {
        return $this->hasMany(Product::class, 'kategori_id', 'id');
    }
    
    // Accessor untuk menampilkan nama kategori dengan huruf besar
    public function getNamaKategoriAttribute($value)
    {
        return ucwords($value);
    }
    
    // Scope untuk pencarian
    public function scopeSearch($query, $search)
    {
        if ($search) {
            return $query->where('nama_kategori', 'LIKE', "%{$search}%")
                         ->orWhere('deskripsi', 'LIKE', "%{$search}%");
        }
        return $query;
    }
}