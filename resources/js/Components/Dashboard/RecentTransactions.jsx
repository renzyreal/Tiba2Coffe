import { Link } from '@inertiajs/react';
import { ShoppingCart, Clock, ChevronRight, Receipt, TrendingUp, Eye, Printer } from 'lucide-react';

export default function RecentTransactions({ recentTransactions, isAdmin }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDateTime = (date) => {
        const d = new Date(date);
        const tanggal = d.toLocaleDateString('id-ID', { day: 'numeric' });
        const bulan = d.toLocaleDateString('id-ID', { month: 'long' });
        const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        return `${tanggal} ${bulan} - ${jam}`;
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Receipt className="h-5 w-5 text-red-500" />
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                            Transaksi Terbaru
                        </h3>
                    </div>
                    {recentTransactions.length > 0 && (
                        <Link 
                            href="/transactions"
                            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium flex items-center gap-1 transition-colors"
                        >
                            Lihat Detail
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    )}
                </div>
            </div>
            
            {recentTransactions.length > 0 ? (
                <div className="overflow-x-auto overflow-y-auto max-h-[280px]">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700/50 sticky top-0">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No. Transaksi</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal & Waktu</th>
                                {isAdmin && (
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Konsumen</th>
                                )}
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {recentTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer" onClick={() => window.open(`/transactions/${transaction.id}`, '_blank')}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                        {transaction.no_transaksi}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                        {formatDateTime(transaction.created_at)}
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                            {transaction.atas_nama || '-'}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400 text-right">
                                        {formatCurrency(transaction.total)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p className="text-sm font-medium">Belum ada transaksi</p>
                    <p className="text-xs mt-1">Mulai buat transaksi baru melalui menu POS</p>
                    {!isAdmin && (
                        <Link 
                            href="/pos"
                            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                            <TrendingUp className="h-4 w-4" />
                            Mulai Transaksi
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
}