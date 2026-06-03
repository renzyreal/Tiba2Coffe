<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Expense extends Model
{
    protected $table = 'expenses';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'tanggal',
        'kategori_pengeluaran',
        'nominal',
        'keterangan',
        'user_id'
    ];
    
    protected $casts = [
        'nominal' => 'decimal:2',
        'tanggal' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relasi ke User
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    
    // Accessor untuk nominal format Rupiah
    public function getNominalFormattedAttribute()
    {
        return 'Rp ' . number_format($this->nominal, 0, ',', '.');
    }
    
    // Scope filter by date
    public function scopeDateRange($query, $startDate, $endDate)
    {
        if ($startDate && $endDate) {
            return $query->whereBetween('tanggal', [$startDate, $endDate]);
        }
        return $query;
    }
    
    // Scope today
    public function scopeToday($query)
    {
        return $query->whereDate('tanggal', today());
    }
}