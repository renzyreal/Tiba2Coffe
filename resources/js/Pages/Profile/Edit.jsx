import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { User, Key, Trash2, Settings, Mail, Lock } from 'lucide-react';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import DeleteUserForm from './Partials/DeleteUserForm';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout>
            <Head title="Pengaturan Profil" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* HEADER SECTION */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Pengaturan Akun</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola profil dan keamanan Anda</p>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {status && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{status}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* MAIN CONTENT - Grid Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Informasi Profil */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-xl">
                                        <User className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Informasi Profil</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Perbarui detail akun Anda</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-2">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                />
                            </div>
                        </div>

                        {/* Keamanan */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 px-6 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded-xl">
                                        <Key className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">Keamanan</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ubah kata sandi Anda</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-2">
                                <UpdatePasswordForm />
                            </div>
                        </div>

                        {/* Zona Bahaya - Full Width */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-red-200 dark:border-red-800 overflow-hidden">
                            <div className="border-b border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-900/20 px-6 py-2">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-xl">
                                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-red-900 dark:text-red-400">Zona Bahaya</h3>
                                        <p className="text-sm text-red-600 dark:text-red-500">Hapus akun Anda secara permanen</p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-2">
                                <DeleteUserForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}