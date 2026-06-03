import React from 'react';
import { Printer, X } from 'lucide-react';

export default function SuccessModal({ isOpen, onClose, onPrint, message, transactionId, transactionNo }) {
    if (!isOpen) return null;

    const handlePrint = () => {
        if (transactionId) {
            window.open(`/transactions/${transactionId}/print`, '_blank');
        }
        if (onPrint) {
            onPrint();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4">
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-black dark:text-white mb-2">
                                Transaksi Berhasil!
                            </h3>
                            <p className="text-sm text-gray-500">
                                {message || 'Transaksi berhasil diproses'}
                            </p>
                            {transactionNo && (
                                <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Nomor Transaksi</p>
                                    <p className="text-sm font-bold text-black dark:text-white">
                                        {transactionNo}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-center gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Tutup
                        </button>
                        <button
                            onClick={handlePrint}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                        >
                            <Printer className="h-4 w-4" />
                            Cetak Struk
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}