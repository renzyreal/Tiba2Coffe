<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategoriesTableSeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nama_kategori' => 'Kopi', 'deskripsi' => 'Minuman kopi berbagai varian, dari espresso hingga kopi susu'],
            ['nama_kategori' => 'Non Kopi', 'deskripsi' => 'Minuman tanpa kopi seperti teh, coklat, dan susu'],
            ['nama_kategori' => 'Snack', 'deskripsi' => 'Camilan ringan untuk menemani minuman'],
            ['nama_kategori' => 'Makanan Berat', 'deskripsi' => 'Makanan untuk mengganjal perut'],
            ['nama_kategori' => 'Minuman Dingin', 'deskripsi' => 'Minuman es segar'],
            ['nama_kategori' => 'Minuman Panas', 'deskripsi' => 'Minuman hangat untuk cuaca dingin'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}