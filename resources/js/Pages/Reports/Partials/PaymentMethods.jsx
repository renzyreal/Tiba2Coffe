import React from 'react';
import { CreditCard, QrCode, Landmark, Wallet } from 'lucide-react';

export default function PaymentMethods({ methods, formatCurrency }) {
    const getMethodIcon = (method) => {
        const icons = {
            'tunai': Wallet,
            'qris': QrCode,
            'transfer_bank': Landmark,
            'credit_card': CreditCard,
        };
        const Icon = icons[method] || Wallet;
        return <Icon className="h-4 w-4" />;
    };

    const getMethodLabel = (method) => {
        const labels = {
            'tunai': 'Tunai',
            'qris': 'QRIS',
            'transfer_bank': 'Transfer Bank',
            'credit_card': 'Kartu Kredit',
        };
        return labels[method] || method;
    };

    const totalTransactions = methods.reduce((sum, m) => sum + (m.total_transaksi || 0), 0);
    const totalNominal = methods.reduce((sum, m) => sum + (m.total_nominal || 0), 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
                <CreditCard className="h-5 w-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    Metode Pembayaran
                </h3>
            </div>

            {methods.length > 0 ? (
                <div className="space-y-3">
                    {methods.map((method, idx) => {
                        const percentage = totalNominal > 0 ? (method.total_nominal / totalNominal) * 100 : 0;
                        return (
                            <div key={idx} className="space-y-1">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        {getMethodIcon(method.metode_pembayaran)}
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {getMethodLabel(method.metode_pembayaran)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500">
                                            {method.total_transaksi} transaksi
                                        </span>
                                        <span className="text-sm font-semibold text-green-600">
                                            {formatCurrency(method.total_nominal)}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                    <div 
                                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between font-medium">
                            <span className="text-sm text-gray-600">Total</span>
                            <span className="text-sm font-bold text-green-600">
                                {formatCurrency(totalNominal)}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{totalTransactions} transaksi</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    <CreditCard className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Belum ada data pembayaran</p>
                </div>
            )}
        </div>
    );
}