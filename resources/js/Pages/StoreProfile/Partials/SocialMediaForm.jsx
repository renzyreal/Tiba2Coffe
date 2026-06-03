import React from 'react';
import { CircleUser } from 'lucide-react';

export default function SocialMediaForm({ formData, handleChange }) {
    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Facebook
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CircleUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="facebook"
                        value={formData.facebook || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder="username"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Instagram
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CircleUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="instagram"
                        value={formData.instagram || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder="@username"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    TikTok
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CircleUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="tiktok"
                        value={formData.tiktok || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder="@username"
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CircleUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        name="whatsapp"
                        value={formData.whatsapp || ''}
                        onChange={handleChange}
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                        placeholder="081234567890"
                    />
                </div>
            </div>
        </div>
    );
}