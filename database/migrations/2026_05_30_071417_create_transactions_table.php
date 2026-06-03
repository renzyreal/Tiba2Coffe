<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('no_transaksi')->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('atas_nama')->nullable(); // TAMBAHKAN INI
            $table->decimal('subtotal', 10, 2);
            $table->decimal('diskon', 10, 2)->default(0);
            $table->enum('jenis_diskon', ['nominal', 'persentase'])->nullable();
            $table->decimal('total', 10, 2);
            $table->decimal('bayar', 10, 2);
            $table->decimal('kembalian', 10, 2);
            $table->enum('metode_pembayaran', ['tunai', 'qris', 'transfer_bank']);
            $table->text('catatan')->nullable();
            $table->date('tanggal');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};