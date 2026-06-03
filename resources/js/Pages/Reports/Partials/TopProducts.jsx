import React from 'react';
import { Package, TrendingUp } from 'lucide-react';

export default function TopProducts({ products, formatCurrency }) {
    const maxSold = products.length > 0 ? Math.max(...products.map(p => p.total_terjual)) : 0;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Top 10 Produk Terlaris
                </h3>
            </div>

            {products.length > 0 ? (
                <div className="space-y-3">
                    {products.map((product, idx) => {
                        const percentage = maxSold > 0 ? (product.total_terjual / maxSold) * 100 : 0;
                        return (
                            <div key={product.product_id} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 w-6">
                                            #{idx + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
                                            {product.product?.nama_produk || 'Produk'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {product.total_terjual} terjual
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {formatCurrency(product.total_nominal)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div 
                                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Package className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada data produk</p>
                </div>
            )}
        </div>
    );
}