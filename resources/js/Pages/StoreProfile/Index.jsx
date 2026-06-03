import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BasicInfoForm from './Partials/BasicInfoForm';
import AddressForm from './Partials/AddressForm';
import SocialMediaForm from './Partials/SocialMediaForm';
import LogoForm from './Partials/LogoForm';
import OperationalHoursForm from './Partials/OperationalHoursForm';
import DescriptionForm from './Partials/DescriptionForm';

export default function Index({ profile }) {
    const [formData, setFormData] = useState(profile);
    const [loading, setLoading] = useState(false);
    const [logoPreview, setLogoPreview] = useState(profile.logo_url);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
            setFormData({
                ...formData,
                logo: file
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                data.append(key, formData[key]);
            }
        });
        data.append('_method', 'PUT');
        
        router.post(`/store-profile/${profile.id}`, data, {
            onSuccess: () => setLoading(false),
            onError: () => setLoading(false)
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Profil Toko" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* HEADER SECTION */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Profil Toko</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Kelola informasi profil toko Anda
                            </p>
                        </div>
                    </div>

                    {/* MAIN CONTENT - Grid Layout */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Informasi Dasar */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Informasi Dasar</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Data utama toko Anda</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <BasicInfoForm 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                    />
                                </div>
                            </div>

                            {/* Alamat */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Alamat</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Lokasi fisik toko Anda</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <AddressForm 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                    />
                                </div>
                            </div>

                            {/* Sosial Media */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.66 0 3-4 3-9s-1.34-9-3-9m0 18c-1.66 0-3-4-3-9s1.34-9 3-9m-9 9a9 9 0 019-9" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Sosial Media</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Tautan media sosial</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <SocialMediaForm 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                    />
                                </div>
                            </div>

                            {/* Logo Toko */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Logo Toko</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Upload logo toko Anda</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <LogoForm 
                                        logoPreview={logoPreview}
                                        handleFileChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {/* Jam Operasional */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Jam Operasional</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Waktu buka dan tutup toko</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <OperationalHoursForm 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                    />
                                </div>
                            </div>

                            {/* Deskripsi Toko */}
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
                                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Deskripsi Toko</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Informasi lengkap tentang toko</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="px-6 py-4">
                                    <DescriptionForm 
                                        formData={formData} 
                                        handleChange={handleChange} 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button - Full Width */}
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-sm"
                            >
                                {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}