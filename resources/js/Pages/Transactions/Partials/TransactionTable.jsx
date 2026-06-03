import React from 'react';
import { Package, Eye, Printer, Edit, CreditCard, User } from 'lucide-react';

export default function TransactionTable({ transactions, onViewDetail, onEdit, formatCurrency, formatDate }) {
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'tunai':
                return <CreditCard className="w-4 h-4" />;
            case 'qris':
                return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;
            case 'transfer_bank':
                return <User className="w-4 h-4" />;
            default:
                return <CreditCard className="w-4 h-4" />;
        }
    };

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'tunai': return 'Tunai';
            case 'qris': return 'QRIS';
            case 'transfer_bank': return 'Transfer Bank';
            default: return method;
        }
    };

    // Format tanggal dengan output: Minggu, 31 Mei 2026 - 15:30
    const formatDateTime = (date) => {
        if (!date) return '-';
        const d = new Date(date);
        const hari = d.toLocaleDateString('id-ID', { weekday: 'long' });
        const tanggal = d.toLocaleDateString('id-ID', { day: 'numeric' });
        const bulan = d.toLocaleDateString('id-ID', { month: 'long' });
        const tahun = d.toLocaleDateString('id-ID', { year: 'numeric' });
        const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        return `${hari}, ${tanggal} ${bulan} ${tahun} - ${jam}`;
    };

    if (!transactions || !transactions.data || transactions.data.length === 0) {
        return (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                <Package className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Tidak ada transaksi</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">No. Transaksi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal & Waktu</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Atas Nama</th>
                        {onEdit && (
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kasir</th>
                        )}
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Metode</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.data.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black dark:text-white">
                                {transaction.no_transaksi}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {formatDateTime(transaction.created_at)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {transaction.atas_nama || '-'}
                            </td>
                            {onEdit && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                    {transaction.user?.name || 'Admin'}
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                    {getPaymentMethodIcon(transaction.metode_pembayaran)}
                                    {getPaymentMethodLabel(transaction.metode_pembayaran)}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400 text-right">
                                {formatCurrency(transaction.total)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewDetail(transaction);
                                        }}
                                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        title="Lihat Detail"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    {onEdit && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEdit(transaction);
                                            }}
                                            className="p-1.5 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                                            title="Edit Transaksi"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(`/transactions/${transaction.id}/print`, '_blank');
                                        }}
                                        className="p-1.5 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                                        title="Cetak Struk"
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}