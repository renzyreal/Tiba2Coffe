import React from 'react';
import { FileText } from 'lucide-react';

export default function DescriptionForm({ formData, handleChange }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Deskripsi Toko
            </label>
            <div className="relative">
                <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                    name="deskripsi"
                    value={formData.deskripsi || ''}
                    onChange={handleChange}
                    rows="5"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                    placeholder="Tulis deskripsi toko Anda di sini..."
                />
            </div>
        </div>
    );
}