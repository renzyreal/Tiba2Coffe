import React from 'react';
import { Plus, MapPin } from 'lucide-react';

export default function LocationHeader({ onAdd }) {
    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-black dark:text-white">
                        Manajemen Lokasi
                    </h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Kelola lokasi pop-up dan partner toko Anda
                    </p>
                </div>
                
                <div className="mt-4 sm:mt-0">
                    <button
                        onClick={onAdd}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                    >
                        <Plus className="h-4 w-4" />
                        Tambah Lokasi
                    </button>
                </div>
            </div>
        </div>
    );
}