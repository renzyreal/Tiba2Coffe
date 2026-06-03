import React from 'react';
import { ShoppingCart, Flame, XCircle } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, formatCurrency }) {
    const isActive = product.status === true || product.status === 1;
    
    return (
        <button
            onClick={() => {
                if (isActive) {
                    onAddToCart(product, 1);
                }
            }}
            disabled={!isActive}
            className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 transition-all text-left group w-full relative overflow-hidden ${
                isActive 
                    ? 'hover:shadow-md cursor-pointer' 
                    : 'opacity-75 cursor-not-allowed'
            }`}
        >
            {/* Badge Best Seller - hanya untuk produk aktif */}
            {isActive && product.is_best_seller && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-md">
                        <Flame className="h-3 w-3" />
                        <span>Best Seller</span>
                    </div>
                </div>
            )}
            
            {/* Badge Habis - untuk produk tidak aktif */}
            {!isActive && (
                <div className="absolute top-0 right-0 z-10">
                    <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 shadow-md">
                        <XCircle className="h-3 w-3" />
                        <span>Habis</span>
                    </div>
                </div>
            )}
            
            {/* Gambar dengan efek grayscale untuk produk habis */}
            <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
                {product.gambar ? (
                    <img
                        src={`/storage/${product.gambar}`}
                        alt={product.nama_produk}
                        className={`w-full h-full object-cover transition-transform ${isActive ? 'group-hover:scale-105' : 'grayscale'}`}
                    />
                ) : (
                    <div className={`text-gray-400 text-center ${!isActive ? 'opacity-50' : ''}`}>
                        <ShoppingCart className="h-8 w-8 mx-auto" />
                        <span className="text-xs">No Image</span>
                    </div>
                )}
            </div>
            
            {/* Nama produk */}
            <h3 className={`font-medium text-sm line-clamp-2 ${!isActive ? 'text-gray-500 dark:text-gray-400' : 'text-black dark:text-white'}`}>
                {product.nama_produk}
            </h3>
            
            {/* Harga */}
            <p className={`font-bold text-sm mt-1 ${!isActive ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-red-600 dark:text-red-400'}`}>
                {formatCurrency(product.harga)}
            </p>
            
            {/* Kategori label */}
            {product.kategori && (
                <p className="text-xs text-gray-500 mt-1">
                    {product.kategori.nama_kategori}
                </p>
            )}
        </button>
    );
}