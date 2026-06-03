import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';

export default function DailySalesTable({ dailySales, formatCurrency, dateRange }) {
    const totalSales = dailySales.reduce((sum, item) => sum + item.total, 0);
    const totalTransactions = dailySales.reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Detail Penjualan Harian
                        </h3>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <div>
                            <span className="text-gray-500">Total:</span>
                            <span className="ml-2 font-semibold text-green-600">{formatCurrency(totalSales)}</span>
                        </div>
                        <div>
                            <span className="text-gray-500">Transaksi:</span>
                            <span className="ml-2 font-semibold">{totalTransactions}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                {dailySales.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Total Penjualan
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Jumlah Transaksi
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Rata-rata per Transaksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {dailySales.map((item, idx) => {
                                const avgPerTransaction = item.count > 0 ? item.total / item.count : 0;
                                return (
                                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {new Date(item.date).toLocaleDateString('id-ID', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-green-600 text-right">
                                            {formatCurrency(item.total)}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400 text-right">
                                            {item.count}
                                        </td>
                                        <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                            {formatCurrency(avgPerTransaction)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <td className="px-6 py-3 text-sm font-bold text-gray-800 dark:text-white">
                                    Total
                                </td>
                                <td className="px-6 py-3 text-sm font-bold text-green-600 text-right">
                                    {formatCurrency(totalSales)}
                                </td>
                                <td className="px-6 py-3 text-sm font-bold text-gray-800 dark:text-white text-right">
                                    {totalTransactions}
                                </td>
                                <td className="px-6 py-3 text-sm font-bold text-gray-800 dark:text-white text-right">
                                    -
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Belum ada data penjualan</p>
                    </div>
                )}
            </div>
        </div>
    );
}