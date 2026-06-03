import React from 'react';
import { X, Filter } from 'lucide-react';

export default function FilterBar({ 
    startDate, setStartDate, 
    endDate, setEndDate, 
    selectedCategory, setSelectedCategory,
    categories = [],
    onSearch, 
    onReset 
}) {
    return (
        <form onSubmit={onSearch} className="w-full">
            <div className="p-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Filter Kategori */}
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 text-sm"
                    >
                        <option value="">Semua Kategori</option>
                        {categories && categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>

                    {/* Start Date */}
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 text-sm"
                        placeholder="Dari Tanggal"
                    />

                    {/* End Date */}
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 text-sm"
                        placeholder="Sampai Tanggal"
                    />

                    {/* Buttons */}
                    <div className="flex gap-2">
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            Filter
                        </button>
                        
                        {(startDate || endDate || selectedCategory) && (
                            <button
                                type="button"
                                onClick={onReset}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}