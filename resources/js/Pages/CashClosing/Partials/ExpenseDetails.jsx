import React from 'react';
import { Receipt, Package, ExternalLink } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function ExpenseDetails({ 
    expenses, 
    formatCurrency, 
    totalPengeluaran,
    selectedDate 
}) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[400px]">
            {/* Header - Fixed */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Receipt className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-black dark:text-white">Rincian Pengeluaran</h3>
                </div>
                <Link
                    href={`/expenses?date=${selectedDate}`}
                    className="text-sm hover:text-red-600 transition-colors inline-flex items-center gap-1"
                >
                    Lihat Semua <ExternalLink className="h-3 w-3" />
                </Link>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 px-6">
                {expenses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Belum ada pengeluaran</p>
                        <p className="text-xs text-gray-400 mt-1">Tidak ada pengeluaran pada tanggal ini</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-between text-sm font-semibold text-gray-600 dark:text-gray-400 pb-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                            <span className="flex-1">Kategori</span>
                            <span className="w-32 text-right">Nominal</span>
                        </div>
                        <div className="space-y-1">
                            {expenses.map((expense, index) => (
                                <div key={expense.id || index} className="flex justify-between text-sm py-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2 transition-colors">
                                    <span className="flex-1 text-gray-700 dark:text-gray-300">
                                        {expense.kategori_pengeluaran || '-'}
                                    </span>
                                    <span className="w-32 text-right font-semibold text-red-600">
                                        {formatCurrency(expense.nominal)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer - Fixed */}
            <div className="flex-shrink-0 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <div className="flex justify-between font-bold">
                    <span>Total Pengeluaran</span>
                    <span className="text-red-600">{formatCurrency(totalPengeluaran)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500 dark:text-gray-400">Jumlah Pengeluaran</span>
                    <span className="font-medium">{expenses.length} transaksi</span>
                </div>
            </div>
        </div>
    );
}