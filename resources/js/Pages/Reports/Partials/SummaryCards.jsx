import React from 'react';
import { ShoppingCart, TrendingUp, Package, Wallet, TrendingDown } from 'lucide-react';

export default function SummaryCards({ summary, formatCurrency }) {
    const cards = [
        {
            title: 'Total Transaksi',
            value: summary.total_transactions?.toLocaleString() || 0,
            icon: ShoppingCart,
            iconBg: 'bg-blue-500',
            gradient: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Total Penjualan',
            value: formatCurrency(summary.total_sales),
            icon: TrendingUp,
            iconBg: 'bg-green-500',
            gradient: 'from-green-500 to-green-600'
        },
        {
            title: 'Total Item Terjual',
            value: summary.total_items_sold?.toLocaleString() || 0,
            icon: Package,
            iconBg: 'bg-purple-500',
            gradient: 'from-purple-500 to-purple-600'
        },
        {
            title: 'Total Pengeluaran',
            value: formatCurrency(summary.total_expenses),
            icon: Wallet,
            iconBg: 'bg-orange-500',
            gradient: 'from-orange-500 to-orange-600'
        },
        {
            title: 'Pendapatan Bersih',
            value: formatCurrency(summary.net_income),
            icon: TrendingDown,
            iconBg: summary.net_income < 0 ? 'bg-red-500' : 'bg-green-500',
            gradient: summary.net_income < 0 ? 'from-red-500 to-red-600' : 'from-green-500 to-green-600'
        },
        {
            title: 'Rata-rata per Hari',
            value: formatCurrency(summary.average_daily_sales),
            icon: TrendingUp,
            iconBg: 'bg-teal-500',
            gradient: 'from-teal-500 to-teal-600'
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className="relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                >
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{card.title}</p>
                            <div className={`${card.iconBg} p-1.5 rounded-lg`}>
                                <card.icon className="h-3 w-3 text-white" />
                            </div>
                        </div>
                        <p className="text-lg font-bold text-gray-800 dark:text-white truncate">
                            {card.value}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}