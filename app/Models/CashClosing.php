<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CashClosing extends Model
{
    protected $table = 'cash_closings';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'tanggal',
        'total_penjualan',
        'total_transaksi',
        'total_pengeluaran',
        'pendapatan_bersih',
        'user_id'
    ];
    
    protected $casts = [
        'total_penjualan' => 'decimal:2',
        'total_transaksi' => 'integer',
        'total_pengeluaran' => 'decimal:2',
        'pendapatan_bersih' => 'decimal:2',
        'tanggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relasi ke User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    // Accessor untuk format Rupiah
    public function getTotalPenjualanFormattedAttribute()
    {
        return 'Rp ' . number_format($this->total_penjualan, 0, ',', '.');
    }
    
    public function getPendapatanBersihFormattedAttribute()
    {
        return 'Rp ' . number_format($this->pendapatan_bersih, 0, ',', '.');
    }
}