<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $table = 'transactions';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'no_transaksi',
        'user_id',
        'atas_nama', // TAMBAHKAN INI
        'subtotal',
        'diskon',
        'jenis_diskon',
        'total',
        'bayar',
        'kembalian',
        'metode_pembayaran',
        'catatan',
        'tanggal'
    ];
    
    protected $casts = [
        'subtotal' => 'decimal:2',
        'diskon' => 'decimal:2',
        'total' => 'decimal:2',
        'bayar' => 'decimal:2',
        'kembalian' => 'decimal:2',
        'tanggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relasi ke User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    // Relasi ke TransactionDetail
    public function details(): HasMany
    {
        return $this->hasMany(TransactionDetail::class, 'transaction_id', 'id');
    }
    
    // Accessor untuk metode pembayaran
    public function getMetodePembayaranTextAttribute()
    {
        $methods = [
            'tunai' => 'Tunai',
            'qris' => 'QRIS',
            'transfer_bank' => 'Transfer Bank'
        ];
        return $methods[$this->metode_pembayaran] ?? $this->metode_pembayaran;
    }
    
    // Boot method untuk auto-generate nomor transaksi
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($transaction) {
            $transaction->no_transaksi = 'TRX-' . date('Ymd') . '-' . str_pad(static::count() + 1, 4, '0', STR_PAD_LEFT);
        });
    }
    
    // Scope filter by date range
    public function scopeDateRange($query, $startDate, $endDate)
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('tanggal', [$startDate, $endDate]);
        }
        return $query;
    }
    
    // Scope for today
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', today());
    }
    
    // Scope for this month
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('tanggal', now()->month)
                     ->whereYear('tanggal', now()->year);
    }
}