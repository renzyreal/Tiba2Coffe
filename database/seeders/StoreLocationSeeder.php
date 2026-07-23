<?php

namespace Database\Seeders;

use App\Models\StoreLocation;
use Illuminate\Database\Seeder;

class StoreLocationSeeder extends Seeder
{
    public function run(): void
    {
        // Lokasi Utama
        StoreLocation::create([
            'nama_lokasi' => 'Main Pop-Up',
            'alamat' => 'Jl. Sudirman No. 123, Jakarta Selatan',
            'hari' => 'Setiap Hari',
            'jam_buka' => '08:00',
            'jam_tutup' => '22:00',
            'status' => 'active',
            'is_main' => true,
            'deskripsi' => 'Lokasi utama kami yang buka setiap hari',
            'map_url' => null,
            'urutan' => 1,
        ]);

        // Cabang 1 - Kampus
        StoreLocation::create([
            'nama_lokasi' => 'Pop-Up - Kampus 1 UNG',
            'alamat' => 'Depan Kampus 1 UNG (Depan PascaSarjana)',
            'hari' => 'Senin - Jumat',
            'jam_buka' => '12:00',
            'jam_tutup' => '17:00',
            'status' => 'active',
            'is_main' => false,
            'deskripsi' => 'Lokasi pop-up di area kampus',
            'map_url' => null,
            'urutan' => 2,
        ]);

        // Cabang 2 - Pasar Central
        StoreLocation::create([
            'nama_lokasi' => 'Pop-Up - Pasar Central',
            'alamat' => 'Pasar Central (Dekat Jembatan Penyebrangan)',
            'hari' => 'Senin - Minggu',
            'jam_buka' => '19:00',
            'jam_tutup' => '02:00',
            'status' => 'active',
            'is_main' => false,
            'deskripsi' => 'Lokasi pop-up malam di pasar central',
            'map_url' => null,
            'urutan' => 3,
        ]);

        // Cabang 3 - Taman Limboto
        StoreLocation::create([
            'nama_lokasi' => 'Pop-Up - Taman Limboto',
            'alamat' => 'Taman Limboto (Depan Kantor Bupati)',
            'hari' => 'Sabtu - Minggu',
            'jam_buka' => '19:00',
            'jam_tutup' => '02:00',
            'status' => 'active',
            'is_main' => false,
            'deskripsi' => 'Lokasi pop-up weekend di taman kota',
            'map_url' => null,
            'urutan' => 4,
        ]);
    }
}