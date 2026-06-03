import React from 'react';
import { History, Package } from 'lucide-react';

export default function ClosingHistory({ recentClosings, formatCurrency, formatDate, formatDateTime }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-purple-600" />
                    <h3 className="text-lg font-semibold text-black dark:text-white">Riwayat Tutup Kas</h3>
                    {recentClosings.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full">
                            {recentClosings.length} data
                        </span>
                    )}
                </div>
            </div>
            
            <div className="overflow-x-auto">
                {recentClosings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Belum ada riwayat tutup kas</p>
                        <p className="text-xs">Riwayat akan muncul setelah melakukan tutup kas</p>
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Penjualan</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Transaksi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Pengeluaran</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pendapatan Bersih</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ditutup oleh</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentClosings.map((closing) => (
                                <tr key={closing.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {formatDate(closing.tanggal)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                        {formatCurrency(closing.total_penjualan)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {closing.total_transaksi}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">
                                        {formatCurrency(closing.total_pengeluaran)}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                                        closing.pendapatan_bersih < 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {formatCurrency(closing.pendapatan_bersih)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {closing.user?.name || 'Admin'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {formatDateTime(closing.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}