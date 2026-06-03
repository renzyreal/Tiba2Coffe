import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

export default function DeleteConfirmation({ isOpen, onClose, onConfirm, title, message, warning }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <div className="px-6 pt-6 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-3">
                                <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-2">
                                    <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                                </div>
                                <h3 className="text-lg font-medium text-black dark:text-white">{title}</h3>
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
                            {warning && (
                                <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">{warning}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}