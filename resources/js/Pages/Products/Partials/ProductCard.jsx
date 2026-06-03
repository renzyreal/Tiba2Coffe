import React from 'react';
import { Edit, Trash2, Package, CheckCircle, XCircle } from 'lucide-react';

export default function ProductCard({ product, onEdit, onDelete, formatCurrency }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            {/* Product Image - Lebih kecil */}
            <div 
                className="relative bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0"
                style={{ height: '150px', width: '100%' }}
            >
                {product.gambar ? (
                    <img
                        src={`/storage/${product.gambar}`}
                        alt={product.nama_produk}
                        className="w-full h-full object-cover object-center"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <Package className="h-12 w-12 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-400">No Image</span>
                    </div>
                )}
            </div>

            {/* Product Info - Padding lebih kecil */}
            <div className="p-3">
                {/* Category */}
                <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                        {product.kategori?.nama_kategori || 'Minuman'}
                    </span>
                </div>

                {/* Product Name */}
                <h3 className="text-sm font-semibold text-black dark:text-white mb-1 line-clamp-2">
                    {product.nama_produk}
                </h3>

                {/* Price */}
                <p className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                    {formatCurrency(product.harga)}
                </p>

                {/* Status and Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                    {/* Status Badge - Lebih kecil */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                        product.status 
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                        {product.status ? (
                            <CheckCircle className="w-3 h-3" />
                        ) : (
                            <XCircle className="w-3 h-3" />
                        )}
                        <span>{product.status ? 'Aktif' : 'Nonaktif'}</span>
                    </div>
                    
                    {/* Action Buttons - Lebih kecil */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => onEdit(product)}
                            className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                            title="Edit"
                        >
                            <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onDelete(product)}
                            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Hapus"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}