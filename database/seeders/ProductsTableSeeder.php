<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductsTableSeeder extends Seeder
{
    public function run(): void
    {
        $products = [
            // Kopi (kategori_id = 1)
            ['kategori_id' => 1, 'nama_produk' => 'Es Kopi Susu', 'harga' => 15000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'Es Kopi Gula Aren', 'harga' => 18000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'American Hot', 'harga' => 12000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'Cappuccino', 'harga' => 18000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'Latte', 'harga' => 17000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'Espresso', 'harga' => 10000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'Mochaccino', 'harga' => 20000, 'status' => true],
            ['kategori_id' => 1, 'nama_produk' => 'Vietnam Drip', 'harga' => 22000, 'status' => true],
            
            // Non Kopi (kategori_id = 2)
            ['kategori_id' => 2, 'nama_produk' => 'Teh Manis', 'harga' => 8000, 'status' => true],
            ['kategori_id' => 2, 'nama_produk' => 'Teh Tarik', 'harga' => 12000, 'status' => true],
            ['kategori_id' => 2, 'nama_produk' => 'Coklat Panas', 'harga' => 15000, 'status' => true],
            ['kategori_id' => 2, 'nama_produk' => 'Susu Jahe', 'harga' => 10000, 'status' => true],
            ['kategori_id' => 2, 'nama_produk' => 'Matcha Latte', 'harga' => 20000, 'status' => true],
            ['kategori_id' => 2, 'nama_produk' => 'Lemon Tea', 'harga' => 12000, 'status' => true],
            
            // Snack (kategori_id = 3)
            ['kategori_id' => 3, 'nama_produk' => 'Roti Bakar Coklat', 'harga' => 10000, 'status' => true],
            ['kategori_id' => 3, 'nama_produk' => 'Roti Bakar Keju', 'harga' => 12000, 'status' => true],
            ['kategori_id' => 3, 'nama_produk' => 'Pisang Goreng', 'harga' => 8000, 'status' => true],
            ['kategori_id' => 3, 'nama_produk' => 'Kentang Goreng', 'harga' => 12000, 'status' => true],
            ['kategori_id' => 3, 'nama_produk' => 'Donat', 'harga' => 6000, 'status' => true],
            ['kategori_id' => 3, 'nama_produk' => 'Pukis', 'harga' => 5000, 'status' => true],
            
            // Makanan Berat (kategori_id = 4)
            ['kategori_id' => 4, 'nama_produk' => 'Mie Goreng', 'harga' => 15000, 'status' => true],
            ['kategori_id' => 4, 'nama_produk' => 'Nasi Goreng', 'harga' => 18000, 'status' => true],
            ['kategori_id' => 4, 'nama_produk' => 'Kwetiau Goreng', 'harga' => 16000, 'status' => true],
            
            // Minuman Dingin (kategori_id = 5)
            ['kategori_id' => 5, 'nama_produk' => 'Es Jeruk', 'harga' => 10000, 'status' => true],
            ['kategori_id' => 5, 'nama_produk' => 'Es Kelapa Muda', 'harga' => 12000, 'status' => true],
            ['kategori_id' => 5, 'nama_produk' => 'Es Campur', 'harga' => 15000, 'status' => true],
            
            // Minuman Panas (kategori_id = 6)
            ['kategori_id' => 6, 'nama_produk' => 'Bandrek', 'harga' => 10000, 'status' => true],
            ['kategori_id' => 6, 'nama_produk' => 'Sekoteng', 'harga' => 12000, 'status' => true],
            ['kategori_id' => 6, 'nama_produk' => 'Wedang Jahe', 'harga' => 9000, 'status' => true],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}