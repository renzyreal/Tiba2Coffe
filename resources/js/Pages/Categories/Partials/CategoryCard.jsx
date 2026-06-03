import React from 'react';
import { Pencil, Trash2, FolderOpen } from 'lucide-react';

export default function CategoryCard({ category, onEdit, onDelete }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                                <FolderOpen className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                            </div>
                            <h3 className="text-base font-semibold text-black dark:text-white">
                                {category.nama_kategori}
                            </h3>
                        </div>
                        {category.deskripsi && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {category.deskripsi}
                            </p>
                        )}
                    </div>
                    <div className="flex space-x-1 ml-3">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            title="Edit"
                        >
                            <Pencil className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(category)}
                            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                            title="Hapus"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="pt-3 mt-2 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        Dibuat: {new Date(category.created_at).toLocaleDateString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    );
}