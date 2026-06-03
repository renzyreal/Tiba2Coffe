import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Printer, ChevronDown, Loader } from 'lucide-react';

export default function ExportButtons({ onExport, isLoading }) {
    const [showDropdown, setShowDropdown] = useState(false);

    const exportOptions = [
        { id: 'excel', label: 'Export ke Excel', icon: FileSpreadsheet, color: 'green' },
        { id: 'pdf', label: 'Export ke PDF', icon: FileText, color: 'red' },
        { id: 'print', label: 'Cetak Laporan', icon: Printer, color: 'blue' },
    ];

    const handleExport = (format) => {
        if (format === 'print') {
            window.print();
        } else {
            onExport(format);
        }
        setShowDropdown(false);
    };

    return (
        <div className="relative">
            {/* Tombol Export Utama - Warna MERAH agar terlihat */}
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 border border-red-700"
            >
                {isLoading ? (
                    <>
                        <Loader className="h-4 w-4 animate-spin" />
                        Memproses...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4" />
                        Export Laporan
                        <ChevronDown className="h-4 w-4" />
                    </>
                )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && !isLoading && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Pilih Format Export
                            </p>
                        </div>
                        {exportOptions.map((option) => {
                            const Icon = option.icon;
                            const colorClasses = {
                                green: 'text-green-600 bg-green-50 dark:bg-green-900/20',
                                red: 'text-red-600 bg-red-50 dark:bg-red-900/20',
                                blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
                                gray: 'text-gray-600 bg-gray-50 dark:bg-gray-700',
                            };
                            return (
                                <button
                                    key={option.id}
                                    onClick={() => handleExport(option.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                                >
                                    <div className={`p-1.5 rounded ${colorClasses[option.color]}`}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}