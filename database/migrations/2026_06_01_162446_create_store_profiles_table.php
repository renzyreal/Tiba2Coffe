<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('store_profiles', function (Blueprint $table) {
            $table->id();
            $table->string('nama_toko', 100)->default('Kopi POS');
            $table->string('pemilik', 100)->nullable();
            $table->string('no_telp', 20)->nullable();
            $table->string('email', 100)->nullable();
            $table->text('alamat')->nullable();
            $table->string('kode_pos', 10)->nullable();
            $table->string('logo')->nullable(); // path logo
            $table->string('instagram', 100)->nullable();
            $table->string('facebook', 100)->nullable();
            $table->string('tiktok', 100)->nullable();
            $table->string('whatsapp', 20)->nullable();
            $table->text('deskripsi')->nullable();
            $table->string('waktu_buka', 50)->nullable();
            $table->string('waktu_tutup', 50)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('store_profiles');
    }
};