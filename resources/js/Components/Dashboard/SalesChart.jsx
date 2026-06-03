import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info, Calendar } from 'lucide-react';

export default function SalesChart({ weeklySales, monthlySales }) {
    const [viewType, setViewType] = useState('weekly'); // 'weekly' or 'monthly'

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-semibold text-gray-800 dark:text-white">{label}</p>
                    <p className="text-sm text-green-600 font-bold">
                        {formatCurrency(payload[0].value)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Data untuk Weekly
    const weeklyData = weeklySales || [];
    const totalWeek = weeklyData.reduce((sum, item) => sum + (item.total || 0), 0);
    const averageDaily = weeklyData.length > 0 ? totalWeek / weeklyData.length : 0;

    // Data untuk Monthly
    const monthlyData = monthlySales || [];
    const totalYear = monthlyData.reduce((sum, item) => sum + (item.total || 0), 0);
    const averageMonthly = monthlyData.length > 0 ? totalYear / monthlyData.length : 0;

    const currentData = viewType === 'weekly' ? weeklyData : monthlyData;
    const currentTotal = viewType === 'weekly' ? totalWeek : totalYear;
    const currentAverage = viewType === 'weekly' ? averageDaily : averageMonthly;
    const currentDataKey = viewType === 'weekly' ? 'tanggal' : 'bulan';
    const currentTitle = viewType === 'weekly' ? 'Penjualan 7 Hari Terakhir' : 'Penjualan 12 Bulan Terakhir';
    const currentTotalLabel = viewType === 'weekly' ? 'Total Minggu Ini' : 'Total Tahun Ini';
    const currentAvgLabel = viewType === 'weekly' ? 'Rata-rata per Hari' : 'Rata-rata per Bulan';

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            {/* Header dengan Toggle Button */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {currentTitle}
                    </h3>
                </div>
                
                {/* Toggle Button Group */}
                <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                    <button
                        onClick={() => setViewType('weekly')}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                            viewType === 'weekly' 
                                ? 'bg-green-500 text-white shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <Info className="h-3.5 w-3.5" />
                        Mingguan
                    </button>
                    <button
                        onClick={() => setViewType('monthly')}
                        className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${
                            viewType === 'monthly' 
                                ? 'bg-green-500 text-white shadow-sm' 
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                        }`}
                    >
                        <Calendar className="h-3.5 w-3.5" />
                        Bulanan
                    </button>
                </div>
            </div>
            
            {/* Ringkasan */}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{currentTotalLabel}</p>
                        <p className="text-lg font-bold text-green-600">
                            {formatCurrency(currentTotal)}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{currentAvgLabel}</p>
                        <p className="text-lg font-bold text-green-600">
                            {formatCurrency(currentAverage)}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Chart */}
            {currentData.length > 0 ? (
                <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentData} margin={{ top: 30, right: 30, left: 20, bottom: 30 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis 
                                dataKey={currentDataKey} 
                                stroke="#9ca3af"
                                angle={-45}
                                textAnchor="end"
                                height={60}
                                interval={0}
                                tick={{ fontSize: 11 }}
                            />
                            <YAxis 
                                stroke="#9ca3af"
                                tickFormatter={(value) => formatCurrency(value).replace('Rp', '').trim()}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar 
                                dataKey="total" 
                                name="Penjualan"
                                fill="#10b981" 
                                radius={[4, 4, 0, 0]}
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <TrendingUp className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Belum ada data penjualan</p>
                </div>
            )}
        </div>
    );
}