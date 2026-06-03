<?php

namespace Database\Seeders;

use App\Models\StoreProfile;
use Illuminate\Database\Seeder;

class StoreProfileSeeder extends Seeder
{
    public function run(): void
    {
        StoreProfile::create([
            'nama_toko' => 'Kopi POS',
            'pemilik' => 'Admin User',
            'no_telp' => '081234567890',
            'email' => 'info@kopipos.com',
            'alamat' => 'Jl. Sudirman No. 123, Jakarta Selatan',
            'kode_pos' => '12190',
            'instagram' => '@kopipos',
            'facebook' => 'kopipos',
            'tiktok' => '@kopipos',
            'whatsapp' => '081234567890',
            'deskripsi' => 'Sistem POS modern untuk bisnis kopi dan kuliner',
            'waktu_buka' => '08:00',
            'waktu_tutup' => '22:00',
            'is_active' => true,
        ]);
    }
}