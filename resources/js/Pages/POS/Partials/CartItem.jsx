import React from 'react';
import { Plus, Minus, ShoppingCart, Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove, formatCurrency }) {
    return (
        <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            {/* Image */}
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-lg flex-shrink-0 overflow-hidden">
                {item.gambar ? (
                    <img
                        src={`/storage/${item.gambar}`}
                        alt={item.nama_produk}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>
            
            {/* Info Product */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm text-black dark:text-white truncate">
                    {item.nama_produk}
                </h3>
                <p className="text-red-600 dark:text-red-400 font-bold text-xs">
                    {formatCurrency(item.harga)}
                </p>
                {/* Quantity controls - dipindah ke bawah harga */}
                <div className="flex items-center gap-1 mt-1">
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.jumlah - 1)}
                        className="p-0.5 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-xs font-medium">{item.jumlah}</span>
                    <button
                        onClick={() => onUpdateQuantity(item.id, item.jumlah + 1)}
                        className="p-0.5 rounded bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>
            </div>
            
            {/* Price Total & Delete */}
            <div className="flex flex-col items-end justify-between">
                <p className="font-semibold text-sm">
                    {formatCurrency(item.harga * item.jumlah)}
                </p>
                <button
                    onClick={() => onRemove(item.id)}
                    className="text-red-500 hover:text-red-600"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}