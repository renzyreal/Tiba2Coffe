<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class StoreLocation extends Model
{
    use HasFactory;

    protected $table = 'store_locations';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'nama_lokasi',
        'alamat',
        'hari',
        'jam_buka',
        'jam_tutup',
        'status',
        'is_main',
        'deskripsi',
        'map_url',
        'urutan',
    ];

    protected $casts = [
        'is_main' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Accessor untuk jam operasional (tanpa detik)
    public function getJamOperasionalAttribute()
    {
        if ($this->jam_buka && $this->jam_tutup) {
            return date('H:i', strtotime($this->jam_buka)) . ' - ' . date('H:i', strtotime($this->jam_tutup));
        }
        return 'Jam belum diatur';
    }

    // Accessor untuk status badge
    public function getStatusBadgeAttribute()
    {
        $badges = [
            'active' => 'bg-green-100 text-green-700',
            'inactive' => 'bg-gray-100 text-gray-700',
            'holiday' => 'bg-red-100 text-red-700',
        ];
        return $badges[$this->status] ?? 'bg-gray-100 text-gray-700';
    }

    // Accessor untuk status text
    public function getStatusTextAttribute()
    {
        $texts = [
            'active' => 'Buka',
            'inactive' => 'Tutup',
            'holiday' => 'Libur',
        ];
        return $texts[$this->status] ?? $this->status;
    }

    // Scope untuk lokasi aktif
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope untuk lokasi utama
    public function scopeMain($query)
    {
        return $query->where('is_main', true);
    }
}