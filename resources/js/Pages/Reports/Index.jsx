import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ReportHeader from './Partials/ReportHeader';
import SummaryCards from './Partials/SummaryCards';
import SalesChart from './Partials/SalesChart';
import ExpenseChart from './Partials/ExpenseChart';
import TopProducts from './Partials/TopProducts';
import PaymentMethods from './Partials/PaymentMethods';
import DailySalesTable from './Partials/DailySalesTable';
import TopCategories from './Partials/TopCategories';

export default function Index({ reportData, filters }) {
    const [loading, setLoading] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState(filters.period || 'monthly');
    const [customDate, setCustomDate] = useState({
        start_date: filters.start_date,
        end_date: filters.end_date
    });

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const handlePeriodChange = (period) => {
        setSelectedPeriod(period);
        setLoading(true);
        
        if (period === 'custom') {
            setLoading(false);
            return;
        }
        
        router.get('/reports', { period: period }, {
            preserveState: true,
            onFinish: () => setLoading(false)
        });
    };

    const handleCustomDateChange = (e) => {
        setCustomDate({
            ...customDate,
            [e.target.name]: e.target.value
        });
    };

    const applyCustomDate = () => {
        if (customDate.start_date && customDate.end_date) {
            setSelectedPeriod('custom');
            setLoading(true);
            router.get('/reports', { 
                period: 'custom',
                start_date: customDate.start_date, 
                end_date: customDate.end_date 
            }, {
                preserveState: true,
                onFinish: () => setLoading(false)
            });
        }
    };

    const handleExport = (format) => {
        setIsExporting(true);
        const startDate = filters.start_date;
        const endDate = filters.end_date;
        
        // Gunakan GET request dengan window.open
        const url = `/reports/export?format=${format}&start_date=${startDate}&end_date=${endDate}`;
        window.open(url, '_blank');
        
        setTimeout(() => setIsExporting(false), 500);
    };

    const getChartTitle = () => {
        switch (selectedPeriod) {
            case 'today': return 'Penjualan Hari Ini';
            case 'weekly': return 'Penjualan 7 Hari Terakhir';
            case 'monthly': return 'Penjualan Bulan Ini';
            case 'yearly': return 'Penjualan 12 Bulan Terakhir';
            case 'custom': return `Penjualan ${filters.start_date} s/d ${filters.end_date}`;
            default: return 'Penjualan';
        }
    };

    const getExpenseTitle = () => {
        switch (selectedPeriod) {
            case 'today': return 'Pengeluaran Hari Ini';
            case 'weekly': return 'Pengeluaran 7 Hari Terakhir';
            case 'monthly': return 'Pengeluaran Bulan Ini';
            case 'yearly': return 'Pengeluaran 12 Bulan Terakhir';
            case 'custom': return `Pengeluaran ${filters.start_date} s/d ${filters.end_date}`;
            default: return 'Pengeluaran';
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout>
                <Head title="Laporan" />
                <div className="flex justify-center items-center h-96">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Memuat data laporan...</p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout>
            <Head title="Laporan" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <ReportHeader 
                        selectedPeriod={selectedPeriod}
                        onPeriodChange={handlePeriodChange}
                        customDate={customDate}
                        onCustomDateChange={handleCustomDateChange}
                        onApplyCustomDate={applyCustomDate}
                        onExport={handleExport}
                        isLoading={isExporting}
                    />

                    <SummaryCards 
                        summary={reportData.summary} 
                        formatCurrency={formatCurrency}
                    />

                    {/* Sales Chart */}
                    <div className="mt-6">
                        <SalesChart 
                            data={reportData.sales_chart_data || []}
                            title={getChartTitle()}
                            formatCurrency={formatCurrency}
                        />
                    </div>

                    {/* Expense Chart */}
                    <div className="mt-6">
                        <ExpenseChart 
                            data={reportData.expense_chart_data || []}
                            title={getExpenseTitle()}
                            formatCurrency={formatCurrency}
                            topCategories={reportData.top_expense_categories}
                        />
                    </div>

                    {/* Top Products & Payment Methods */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <TopProducts 
                            products={reportData.top_products}
                            formatCurrency={formatCurrency}
                        />
                        <PaymentMethods 
                            methods={reportData.payment_methods}
                            formatCurrency={formatCurrency}
                        />
                    </div>

                    {/* Top Categories */}
                    <div className="mt-6">
                        <TopCategories 
                            categories={reportData.top_categories}
                            formatCurrency={formatCurrency}
                        />
                    </div>

                    {/* Daily Sales Table */}
                    <div className="mt-6">
                        <DailySalesTable 
                            dailySales={reportData.daily_sales}
                            formatCurrency={formatCurrency}
                            dateRange={reportData.date_range}
                        />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}