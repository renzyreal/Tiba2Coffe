import React from 'react';
import { Wallet, Edit2, Trash2, Clock } from 'lucide-react';
import CategoryBadge from './CategoryBadge';

export default function ExpenseTable({ expenses, onEdit, onDelete, formatCurrency, formatDate }) {
    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!expenses || !expenses.data || expenses.data.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Wallet className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p className="text-sm font-medium">Belum ada data pengeluaran</p>
                <p className="text-xs mt-1">Mulai dengan menambahkan pengeluaran baru</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tanggal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Kategori</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Keterangan</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Dicatat oleh</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nominal</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Waktu Input</th>
                        <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {expenses.data.map((expense) => (
                        <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {expense.id}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(expense.tanggal)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                <CategoryBadge category={expense.kategori_pengeluaran} />
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                {expense.keterangan || '-'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                {expense.user?.name || 'Admin'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-semibold text-red-600 dark:text-red-400 text-right">
                                {formatCurrency(expense.nominal)}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 text-center">
                                <div className="flex items-center justify-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{formatDateTime(expense.created_at)}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-center">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(expense)}
                                        className="p-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(expense)}
                                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                        title="Hapus"
                                    >
                                        <Trash2 className="w-4 h-4" />
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