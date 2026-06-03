import React from 'react';
import { Calendar } from 'lucide-react';
import ExportButtons from './ExportButtons';

export default function ReportHeader({ 
    selectedPeriod, 
    onPeriodChange, 
    customDate, 
    onCustomDateChange, 
    onApplyCustomDate,
    onExport,
    isLoading 
}) {
    const periods = [
        { id: 'today', label: 'Hari Ini' },
        { id: 'weekly', label: 'Minggu Ini' },
        { id: 'monthly', label: 'Bulan Ini' },
        { id: 'yearly', label: 'Tahun Ini' },
        { id: 'custom', label: 'Custom' },
    ];

    return (
        <div className="mb-6">
            {/* Header dengan judul di kiri dan tombol export di kanan */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">Laporan Penjualan</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Analisis penjualan, produk terlaris, dan statistik lengkap
                    </p>
                </div>
                
                {/* Tombol Export di sebelah kanan */}
                <div className="mt-4 sm:mt-0">
                    <ExportButtons onExport={onExport} isLoading={isLoading} />
                </div>
            </div>

            {/* Filter Period */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Periode:</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                        {periods.map((period) => (
                            <button
                                key={period.id}
                                onClick={() => onPeriodChange(period.id)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                                    selectedPeriod === period.id
                                        ? 'bg-red-600 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                            >
                                {period.label}
                            </button>
                        ))}
                    </div>

                    {selectedPeriod === 'custom' && (
                        <div className="flex items-center gap-2 ml-auto">
                            <input
                                type="date"
                                name="start_date"
                                value={customDate.start_date}
                                onChange={onCustomDateChange}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                            />
                            <span className="text-gray-500">s/d</span>
                            <input
                                type="date"
                                name="end_date"
                                value={customDate.end_date}
                                onChange={onCustomDateChange}
                                className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white"
                            />
                            <button
                                onClick={onApplyCustomDate}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Terapkan
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}