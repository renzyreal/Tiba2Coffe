import React from 'react';
import { AlertCircle, X, MapPin } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm, location, loading }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                        Konfirmasi Hapus
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            Apakah Anda yakin ingin menghapus lokasi ini?
                        </p>
                    </div>
                    
                    {location && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
                            <div className="flex items-center gap-3">
                                <MapPin className="h-5 w-5 text-red-500" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-white">
                                        {location.nama_lokasi}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {location.alamat}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <p className="text-sm text-red-600 dark:text-red-400">
                        Tindakan ini tidak dapat dibatalkan!
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        Batal
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Memproses...' : 'Ya, Hapus'}
                    </button>
                </div>
            </div>
        </div>
    );
}