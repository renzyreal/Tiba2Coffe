<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionDetail extends Model
{
    protected $table = 'transaction_details';
    protected $primaryKey = 'id';
    
    protected $fillable = [
        'transaction_id',
        'product_id',
        'jumlah',
        'harga',
        'subtotal',
        'catatan'
    ];
    
    protected $casts = [
        'jumlah' => 'integer',
        'harga' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relasi ke Transaction
    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class, 'transaction_id', 'id');
    }
    
    // Relasi ke Product
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
    
    // Accessor untuk subtotal dengan format Rupiah
    public function getSubtotalFormattedAttribute()
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }
}