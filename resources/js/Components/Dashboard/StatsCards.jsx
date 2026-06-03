import { TrendingUp, ShoppingCart, Wallet, TrendingDown } from 'lucide-react';

export default function StatsCards({ stats, realtimeData, isAdmin }) {
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);
    };

    const getStatCards = () => {
        const adminCards = [
            {
                id: 'sales',
                title: 'Penjualan Hari Ini',
                value: formatCurrency(realtimeData.todaySales),
                icon: TrendingUp,
                iconBg: 'bg-green-500',
                gradient: 'from-green-500 to-green-600',
                trend: '+12.5%',
                trendText: 'dari kemarin'
            },
            {
                id: 'expenses',
                title: 'Pengeluaran Hari Ini',
                value: formatCurrency(realtimeData.todayExpenses),
                icon: TrendingDown,
                iconBg: 'bg-orange-500',
                gradient: 'from-orange-500 to-orange-600',
                trend: '-3.1%',
                trendText: 'dari kemarin'
            },
            {
                id: 'income',
                title: 'Pendapatan Bersih',
                value: formatCurrency(realtimeData.todayNetIncome),
                icon: Wallet,
                iconBg: 'bg-purple-500',
                gradient: 'from-purple-500 to-purple-600',
                trend: '+15.3%',
                trendText: 'dari kemarin'
            }
        ];

        const cashierCards = [
            {
                id: 'sales',
                title: 'Penjualan Hari Ini',
                value: formatCurrency(realtimeData.todaySales),
                icon: TrendingUp,
                iconBg: 'bg-green-500',
                gradient: 'from-green-500 to-green-600',
                trend: '+12.5%',
                trendText: 'dari kemarin'
            },
            {
                id: 'transactions',
                title: 'Transaksi Hari Ini',
                value: realtimeData.todayTransactions.toLocaleString('id-ID'),
                icon: ShoppingCart,
                iconBg: 'bg-blue-500',
                gradient: 'from-blue-500 to-blue-600',
                trend: '+8.2%',
                trendText: 'dari kemarin'
            },
            {
                id: 'income',
                title: 'Pendapatan Bersih',
                value: formatCurrency(realtimeData.todayNetIncome),
                icon: Wallet,
                iconBg: 'bg-purple-500',
                gradient: 'from-purple-500 to-purple-600',
                trend: '+15.3%',
                trendText: 'dari kemarin'
            }
        ];

        return isAdmin ? adminCards : cashierCards;
    };

    const cards = getStatCards();
    const gridCols = cards.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3';

    return (
        <div className="space-y-6">
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${gridCols} gap-6`}>
                {cards.map((card, index) => (
                    <div
                        key={index}
                        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                    >
                        {/* Gradient Border Top */}
                        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}></div>
                        
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        {card.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                                        {card.value}
                                    </p>
                                </div>
                                <div className={`${card.iconBg} p-3 rounded-xl shadow-lg`}>
                                    <card.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                            
                            {/* Trend Indicator */}
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {card.id === 'expenses' ? (
                                            card.trend.startsWith('-') ? (
                                                <>
                                                    <TrendingDown className="h-4 w-4 text-red-500" />
                                                    <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                                                        {card.trend}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <TrendingUp className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                        {card.trend}
                                                    </span>
                                                </>
                                            )
                                        ) : (
                                            <>
                                                <TrendingUp className="h-4 w-4 text-green-500" />
                                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                                                    {card.trend}
                                                </span>
                                            </>
                                        )}
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {card.trendText}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Hover Effect */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}