import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ConfirmModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    loading, 
    selectedDate, 
    safeData, 
    formatDate, 
    formatCurrency,
    title = "Konfirmasi Tutup Kas",
    confirmText = "Ya, Tutup Kas",
    confirmColor = "red",
    message
}) {
    if (!isOpen) return null;

    const getButtonColor = () => {
        switch(confirmColor) {
            case 'red':
                return 'bg-red-600 hover:bg-red-700';
            case 'yellow':
                return 'bg-yellow-500 hover:bg-yellow-600';
            case 'green':
                return 'bg-green-600 hover:bg-green-700';
            default:
                return 'bg-red-600 hover:bg-red-700';
        }
    };

    const getIconBg = () => {
        switch(confirmColor) {
            case 'red':
                return 'bg-red-100 dark:bg-red-900/30';
            case 'yellow':
                return 'bg-yellow-100 dark:bg-yellow-900/30';
            case 'green':
                return 'bg-green-100 dark:bg-green-900/30';
            default:
                return 'bg-yellow-100 dark:bg-yellow-900/30';
        }
    };

    const getIcon = () => {
        if (confirmColor === 'yellow') {
            return <RefreshCw className="h-6 w-6 text-yellow-600" />;
        }
        return <AlertCircle className={`h-6 w-6 ${confirmColor === 'red' ? 'text-red-600' : 'text-green-600'}`} />;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-full ${getIconBg()}`}>
                            {getIcon()}
                        </div>
                        <h3 className="text-lg font-medium text-black dark:text-white">
                            {title}
                        </h3>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {message || `Apakah Anda yakin ingin melakukan tutup kas untuk tanggal ${formatDate(selectedDate)}?`}
                    </p>
                    
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Penjualan</span>
                            <span className="font-semibold text-green-600">{formatCurrency(safeData.total_penjualan)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Total Pengeluaran</span>
                            <span className="font-semibold text-red-600">{formatCurrency(safeData.total_pengeluaran)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                            <span className="font-medium text-gray-700 dark:text-gray-300">Pendapatan Bersih</span>
                            <span className={`font-bold ${safeData.pendapatan_bersih < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(safeData.pendapatan_bersih)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className={`px-4 py-2 ${getButtonColor()} text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Memproses...
                            </>
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}