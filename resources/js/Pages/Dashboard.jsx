import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';
import { RefreshCw } from 'lucide-react';
import StatsCards from '@/Components/Dashboard/StatsCards';
import SalesChart from '@/Components/Dashboard/SalesChart'; // SATU komponen untuk penjualan
import ExpenseChart from '@/Components/Dashboard/ExpenseChart'; // SATU komponen untuk pengeluaran
import RecentTransactions from '@/Components/Dashboard/RecentTransactions';
import PopularProducts from '@/Components/Dashboard/PopularProducts';
import TodaySummary from '@/Components/Dashboard/TodaySummary';
import CashierTips from '@/Components/Dashboard/CashierTips';

export default function Dashboard({ stats, weeklySales, weeklyExpenses, monthlySales, monthlyExpenses, topExpenseCategories, recentTransactions }) {
    const { user } = usePage().props.auth;
    const [realtimeData, setRealtimeData] = useState({
        todaySales: stats.todaySales,
        todayTransactions: stats.todayTransactions,
        todayExpenses: stats.todayExpenses,
        monthlyExpenses: stats.monthlyExpenses,
        todayNetIncome: stats.todayNetIncome
    });
    const [isRefreshing, setIsRefreshing] = useState(false);
    const isAdmin = user?.role === 'admin';
    const isCashier = user?.role === 'cashier';

    useEffect(() => {
        if (!isAdmin) return;
        
        const interval = setInterval(() => {
            refreshData();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const refreshData = async () => {
        if (!isAdmin) return;
        
        setIsRefreshing(true);
        try {
            const response = await fetch('/dashboard/refresh');
            const data = await response.json();
            setRealtimeData(prev => ({
                ...prev,
                todaySales: data.todaySales,
                todayTransactions: data.todayTransactions,
                todayExpenses: data.todayExpenses,
                monthlyExpenses: data.monthlyExpenses,
                todayNetIncome: data.todayNetIncome
            }));
        } catch (error) {
            console.error('Error refreshing data:', error);
        } finally {
            setIsRefreshing(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Dashboard</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Selamat datang kembali, {user?.name}! {isAdmin ? 'Anda memiliki akses penuh.' : 'Kelola transaksi dengan mudah.'}
                            </p>
                        </div>
                        
                        {isAdmin && (
                            <button
                                onClick={refreshData}
                                disabled={isRefreshing}
                                className="mt-4 sm:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 shadow-sm"
                            >
                                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                                Refresh Data
                            </button>
                        )}
                    </div>

                    {/* Stats Cards */}
                    <StatsCards stats={stats} realtimeData={realtimeData} isAdmin={isAdmin} />

                    {/* Charts - HANYA UNTUK ADMIN */}
                    {isAdmin && (
                        <>
                            {/* Row 1: Penjualan - SATU KOMPONEN dengan toggle */}
                            <div className="mt-6">
                                <SalesChart 
                                    weeklySales={weeklySales}
                                    monthlySales={monthlySales}
                                />
                            </div>
                            
                            {/* Row 2: Pengeluaran - SATU KOMPONEN dengan toggle */}
                            <div className="mt-6">
                                <ExpenseChart 
                                    weeklyExpenses={weeklyExpenses}
                                    monthlyExpenses={monthlyExpenses}
                                    topCategories={topExpenseCategories}
                                />
                            </div>
                        </>
                    )}

                    {/* Ringkasan untuk kasir - TANPA CHART */}
                    {isCashier && (
                        <div className="mt-6">
                            <TodaySummary 
                                todaySales={realtimeData.todaySales}
                                todayTransactions={realtimeData.todayTransactions}
                                todayNetIncome={realtimeData.todayNetIncome}
                            />
                        </div>
                    )}

                    {/* Recent Transactions & Popular Products */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <RecentTransactions 
                            recentTransactions={recentTransactions} 
                            isAdmin={isAdmin} 
                        />
                        <PopularProducts />
                    </div>

                    {/* Cashier Tips */}
                    {isCashier && (
                        <div className="mt-6">
                            <CashierTips lowStockCount={realtimeData.lowStockCount} />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}