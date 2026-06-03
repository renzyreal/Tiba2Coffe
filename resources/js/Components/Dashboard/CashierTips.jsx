import { TrendingUp, Lightbulb, ShoppingCart, Clock } from 'lucide-react';

export default function CashierTips({ lowStockCount }) {
    const tips = [
        {
            icon: ShoppingCart,
            title: 'Proses Transaksi',
            description: 'Gunakan fitur POS untuk memproses pesanan pelanggan dengan cepat dan akurat.'
        },
        {
            icon: Clock,
            title: 'Kelola Waktu',
            description: 'Pastikan setiap transaksi dicatat dengan benar untuk menghindari kesalahan.'
        },
        {
            icon: TrendingUp,
            title: 'Tingkatkan Penjualan',
            description: 'Rekomendasikan produk terlaris kepada pelanggan untuk meningkatkan omzet.'
        }
    ];

    return (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
            <div className="p-5">
                <div className="flex items-start gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-xl">
                        <Lightbulb className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-lg mb-2">
                            💡 Tips untuk Kasir
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                            {tips.map((tip, index) => (
                                <div key={index} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                                    <div className="flex items-center gap-2 mb-2">
                                        <tip.icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        <h5 className="font-medium text-sm text-blue-800 dark:text-blue-300">
                                            {tip.title}
                                        </h5>
                                    </div>
                                    <p className="text-xs text-blue-700 dark:text-blue-400">
                                        {tip.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {lowStockCount > 0 && (
                            <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                                <p className="text-xs text-yellow-800 dark:text-yellow-300">
                                    ⚠️ Terdapat {lowStockCount} produk dengan stok menipis. Segera laporkan ke admin!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500"></div>
        </div>
    );
}