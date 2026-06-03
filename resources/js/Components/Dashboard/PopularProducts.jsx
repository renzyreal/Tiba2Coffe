import { useState, useEffect } from 'react';
import { TrendingUp, Coffee, Package, ChevronRight, AlertCircle } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function PopularProducts() {
    const [popularProducts, setPopularProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let isMounted = true;
        
        const fetchPopularProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/popular-products');
                
                if (!response.ok) {
                    throw new Error('Gagal mengambil data');
                }
                
                const data = await response.json();
                
                if (isMounted) {
                    if (!data || data.length === 0) {
                        // Data dummy untuk tampilan awal
                        setPopularProducts([
                            { name: 'Kopi Hitam', total_sold: 45, revenue: 675000 },
                            { name: 'Cappuccino', total_sold: 38, revenue: 760000 },
                            { name: 'Latte', total_sold: 32, revenue: 640000 },
                            { name: 'Espresso', total_sold: 28, revenue: 420000 },
                            { name: 'Mochaccino', total_sold: 25, revenue: 500000 },
                            { name: 'Caramel Macchiato', total_sold: 20, revenue: 480000 },
                            { name: 'Americano', total_sold: 18, revenue: 360000 },
                            { name: 'White Coffee', total_sold: 15, revenue: 300000 },
                            { name: 'Kopi Tubruk', total_sold: 12, revenue: 240000 },
                            { name: 'Kopi Tarik', total_sold: 10, revenue: 200000 },
                        ]);
                    } else {
                        setPopularProducts(data);
                    }
                }
            } catch (error) {
                console.error('Error fetching popular products:', error);
                if (isMounted) {
                    setError(error.message);
                    // Data dummy untuk sementara
                    setPopularProducts([
                        { name: 'Kopi Hitam', total_sold: 45, revenue: 675000 },
                        { name: 'Cappuccino', total_sold: 38, revenue: 760000 },
                        { name: 'Latte', total_sold: 32, revenue: 640000 },
                        { name: 'Espresso', total_sold: 28, revenue: 420000 },
                        { name: 'Mochaccino', total_sold: 25, revenue: 500000 },
                        { name: 'Caramel Macchiato', total_sold: 20, revenue: 480000 },
                        { name: 'Americano', total_sold: 18, revenue: 360000 },
                        { name: 'White Coffee', total_sold: 15, revenue: 300000 },
                        { name: 'Kopi Tubruk', total_sold: 12, revenue: 240000 },
                        { name: 'Kopi Tarik', total_sold: 10, revenue: 200000 },
                    ]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPopularProducts();
        
        return () => {
            isMounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Produk Terlaris
                        </h3>
                    </div>
                </div>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex items-center justify-between p-3">
                                <div className="flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2"></div>
                                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                </div>
                                <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        Produk Terlaris
                    </h3>
                </div>
            </div>
            
            {error && (
                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">{error}</p>
                </div>
            )}
            
            {/* Container dengan scroll - Tampilkan SEMUA produk langsung */}
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2">
                {popularProducts.length > 0 ? (
                    popularProducts.map((product, index) => {
                        const maxSold = Math.max(...popularProducts.map(p => p.total_sold), 1);
                        const percentage = (product.total_sold / maxSold) * 100;
                        
                        return (
                            <div key={index} className="group">
                                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <Coffee className="h-4 w-4 text-orange-500" />
                                                <p className="font-medium text-gray-800 dark:text-white">
                                                    {product.name}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Terjual: {product.total_sold}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    Revenue: Rp {product.revenue?.toLocaleString('id-ID') || '0'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-gray-800 dark:text-white">
                                            {Math.round(percentage)}%
                                        </div>
                                        <div className="w-16 h-1 bg-gray-200 dark:bg-gray-600 rounded-full mt-1 overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p className="text-sm">Belum ada data penjualan</p>
                        <p className="text-xs mt-1">Mulai lakukan transaksi untuk melihat produk terlaris</p>
                    </div>
                )}
            </div>
        </div>
    );
}