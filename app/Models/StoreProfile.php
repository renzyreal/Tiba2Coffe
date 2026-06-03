<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StoreProfile extends Model
{
    use HasFactory;

    protected $table = 'store_profiles';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'nama_toko',
        'pemilik',
        'no_telp',
        'email',
        'alamat',
        'kode_pos',
        'logo',
        'instagram',
        'facebook',
        'tiktok',
        'whatsapp',
        'deskripsi',
        'waktu_buka',
        'waktu_tutup',
        'is_active',
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Accessor untuk logo URL
    public function getLogoUrlAttribute()
    {
        if ($this->logo) {
            return asset('storage/' . $this->logo);
        }
        return null;
    }
    
    // Accessor untuk jam operasional lengkap
    public function getJamOperasionalAttribute()
    {
        if ($this->waktu_buka && $this->waktu_tutup) {
            return $this->waktu_buka . ' - ' . $this->waktu_tutup;
        }
        return 'Belum diatur';
    }
    
    // Scope untuk toko aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}