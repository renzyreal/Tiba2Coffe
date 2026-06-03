import React from 'react';
import { Image } from 'lucide-react';

export default function LogoForm({ logoPreview, handleFileChange }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Upload Logo Toko
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Image className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="file"
                        name="logo"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-800 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    />
                </div>
            </div>
            {logoPreview && (
                <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-gray-500 mb-2">Preview Logo:</p>
                    <img 
                        src={logoPreview} 
                        alt="Logo Preview" 
                        className="h-24 w-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                    />
                </div>
            )}
        </div>
    );
}