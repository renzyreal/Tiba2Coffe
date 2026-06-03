import React from 'react';
import { Tag, TrendingUp } from 'lucide-react';

export default function TopCategories({ categories, formatCurrency }) {
    const maxSold = categories.length > 0 ? Math.max(...categories.map(c => c.total_terjual)) : 0;
    const totalSales = categories.reduce((sum, c) => sum + c.total_nominal, 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
                <Tag className="h-5 w-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Top 5 Kategori Terlaris
                </h3>
            </div>

            {categories.length > 0 ? (
                <div className="space-y-3">
                    {categories.map((category, idx) => {
                        const percentage = maxSold > 0 ? (category.total_terjual / maxSold) * 100 : 0;
                        return (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-gray-400 w-5">
                                            {idx + 1}
                                        </span>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {category.nama_kategori}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {category.total_terjual} terjual
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {formatCurrency(category.total_nominal)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div 
                                        className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Total Penjualan Kategori</span>
                            <span className="text-sm font-bold text-green-600">{formatCurrency(totalSales)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <Tag className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada data kategori</p>
                </div>
            )}
        </div>
    );
}