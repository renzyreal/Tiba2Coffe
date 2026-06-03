import React from 'react';
import { Search } from 'lucide-react';

export default function FilterBar({ startDate, setStartDate, endDate, setEndDate, onSearch, onReset }) {
    return (
        <form onSubmit={onSearch} className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dari Tanggal</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div className="flex-1 min-w-[150px]">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sampai Tanggal</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500"
                />
            </div>
            <div className="flex items-end gap-2">
                <button
                    type="submit"
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                    <Search className="w-4 h-4" />
                    Filter
                </button>
                {(startDate || endDate) && (
                    <button
                        type="button"
                        onClick={onReset}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>
        </form>
    );
}