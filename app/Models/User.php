<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    // Relasi ke Transaction
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class, 'user_id', 'id');
    }
    
    // Relasi ke Expense
    public function expenses(): HasMany
    {
        return $this->hasMany(Expense::class, 'user_id', 'id');
    }
    
    // Relasi ke CashClosing
    public function cashClosings(): HasMany
    {
        return $this->hasMany(CashClosing::class, 'user_id', 'id');
    }
    
    // Relasi ke StockHistory
    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class, 'user_id', 'id');
    }
    
    // Check role
    public function isAdmin()
    {
        return $this->role === 'admin';
    }
    
    public function isCashier()
    {
        return $this->role === 'cashier';
    }
}