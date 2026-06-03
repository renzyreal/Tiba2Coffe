import React from 'react';
import { TrendingUp, ShoppingCart, Wallet, Receipt } from 'lucide-react';

export default function SummaryCards({ safeData, formatCurrency }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Penjualan - Hijau (pendapatan) */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Penjualan</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(safeData.total_penjualan)}</p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                </div>
            </div>
            
            {/* Total Transaksi - Biru */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Transaksi</p>
                        <p className="text-2xl font-bold text-blue-600">{safeData.total_transaksi}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                        <ShoppingCart className="h-6 w-6 text-blue-600" />
                    </div>
                </div>
            </div>
            
            {/* Total Pengeluaran - Merah (pengeluaran) */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(safeData.total_pengeluaran)}</p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <Receipt className="h-6 w-6 text-red-600" />
                    </div>
                </div>
            </div>
            
            {/* Pendapatan Bersih - Hijau jika positif, Merah jika negatif */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pendapatan Bersih</p>
                        <p className={`text-2xl font-bold ${
                            safeData.pendapatan_bersih < 0 ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {formatCurrency(safeData.pendapatan_bersih)}
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${
                        safeData.pendapatan_bersih < 0 
                            ? 'bg-red-100 dark:bg-red-900/30' 
                            : 'bg-green-100 dark:bg-green-900/30'
                    }`}>
                        <Wallet className={`h-6 w-6 ${
                            safeData.pendapatan_bersih < 0 ? 'text-red-600' : 'text-green-600'
                        }`} />
                    </div>
                </div>
            </div>
        </div>
    );
}