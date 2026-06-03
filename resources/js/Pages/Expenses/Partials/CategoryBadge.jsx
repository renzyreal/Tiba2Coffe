import React from 'react';

const categoryColors = {
    'Listrik': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'Air': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'Gaji': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'Sewa': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Bahan Baku': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'Transportasi': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    'Marketing': 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    'Perawatan': 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400',
    'Alat Kerja': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400',
    'Internet': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'Telepon': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400',
    'Makanan & Minuman': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    'Perlengkapan Kantor': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'Perbaikan': 'bg-stone-100 text-stone-800 dark:bg-stone-900/30 dark:text-stone-400',
    'Pajak': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    'Asuransi': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'Promosi': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
    'Lainnya': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
};

export default function CategoryBadge({ category }) {
    const colorClass = categoryColors[category] || categoryColors['Lainnya'];
    
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
            {category}
        </span>
    );
}