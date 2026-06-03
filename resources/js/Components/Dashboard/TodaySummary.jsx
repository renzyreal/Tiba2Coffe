import { TrendingUp, ShoppingCart, Wallet, Calendar } from 'lucide-react';

export default function TodaySummary({ todaySales = 0, todayTransactions = 0, todayNetIncome = 0 }) {
    const currentHour = new Date().getHours();
    const greeting = currentHour < 12 ? 'Pagi' : currentHour < 18 ? 'Siang' : 'Malam';
    
    // Target harian (misalnya 1.2x dari penjualan hari ini atau minimal 500k)
    const dailyTarget = Math.max(todaySales * 1.2, 500000);
    const percentageToTarget = dailyTarget > 0 ? Math.min((todaySales / dailyTarget) * 100, 100) : 0;
    
    const summaries = [
        {
            label: 'Total Penjualan',
            value: `Rp ${(todaySales || 0).toLocaleString('id-ID')}`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-100 dark:bg-green-900/30'
        },
        {
            label: 'Jumlah Transaksi',
            value: todayTransactions || 0,
            icon: ShoppingCart,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            label: 'Pendapatan Bersih',
            value: `Rp ${(todayNetIncome || 0).toLocaleString('id-ID')}`,
            icon: Wallet,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100 dark:bg-purple-900/30'
        }
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Ringkasan Hari Ini - Selamat {greeting}
                    </h3>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    })}
                </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {summaries.map((item, index) => (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className={`${item.bgColor} p-2 rounded-lg`}>
                                <item.icon className={`h-4 w-4 ${item.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white mt-2">
                            {item.value}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {item.label}
                        </p>
                    </div>
                ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Target Hari Ini:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">
                        Rp {dailyTarget.toLocaleString('id-ID')}
                    </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div 
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${percentageToTarget}%` }}
                    />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    {percentageToTarget.toFixed(1)}% dari target harian
                </p>
            </div>
            
            {/* Motivational message */}
            {percentageToTarget >= 100 && (
                <div className="mt-3 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
                    <p className="text-xs text-green-700 dark:text-green-400 font-semibold">
                        🎉 Selamat! Target hari ini tercapai! 🎉
                    </p>
                </div>
            )}
            {percentageToTarget >= 75 && percentageToTarget < 100 && (
                <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-center">
                    <p className="text-xs text-yellow-700 dark:text-yellow-400">
                        💪 Semangat! Target hampir tercapai!
                    </p>
                </div>
            )}
        </div>
    );
}