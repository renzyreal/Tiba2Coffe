import React from 'react';
import { MapPin, Home } from 'lucide-react';

export default function AddressForm({ formData, handleChange }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Alamat Lengkap
                </label>
                <div className="relative">
                    <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                        <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                        name="alamat"
                        value={formData.alamat || ''}
                        onChange={handleChange}
                        rows="3"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white resize-none"
                        placeholder="Jl. Contoh No. 123, RT/RW, Kelurahan, Kecamatan"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kode Pos
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Home className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="kode_pos"
                        value={formData.kode_pos || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder="Contoh: 12190"
                    />
                </div>
            </div>
        </div>
    );
}