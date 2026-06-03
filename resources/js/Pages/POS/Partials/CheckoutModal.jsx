import React from 'react';
import { X } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, onConfirm, transaction, formatCurrency, loading }) {
    if (!isOpen) return null;

    const { total, paymentMethod, paymentAmount } = transaction;
    const kembalian = paymentMethod === 'tunai' ? paymentAmount - total : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-black dark:text-white">
                                Konfirmasi Pembayaran
                            </h3>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Total Pembayaran</p>
                                <p className="text-2xl font-bold text-red-600">{formatCurrency(total)}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                <p className="text-sm text-gray-600">Metode Pembayaran</p>
                                <p className="font-medium capitalize">
                                    {paymentMethod === 'tunai' ? 'Tunai' : paymentMethod === 'qris' ? 'QRIS' : 'Transfer Bank'}
                                </p>
                            </div>
                            {paymentMethod === 'tunai' && (
                                <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                    <p className="text-sm text-gray-600">Kembalian</p>
                                    <p className="text-lg font-bold text-green-600">{formatCurrency(kembalian)}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 rounded-lg hover:bg-gray-300"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : 'Konfirmasi Bayar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}