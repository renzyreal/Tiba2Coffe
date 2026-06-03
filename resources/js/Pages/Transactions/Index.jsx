import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FilterBar from './Partials/FilterBar';
import TransactionTable from './Partials/TransactionTable';
import DetailModal from './Partials/DetailModal';

export default function Index({ transactions, filters }) {
    const { flash } = usePage().props;
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/transactions', { start_date: startDate, end_date: endDate }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        router.get('/transactions', {}, { preserveState: true, replace: true });
    };

    const handleViewDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTransaction(null);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    // Format tanggal dengan jam (untuk tabel)
    const formatDateTime = (date) => {
        const d = new Date(date);
        const tanggal = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return `${tanggal} ${jam}`;
    };

    // Format tanggal tanpa jam (untuk modal - konsistensi)
    const formatDateOnly = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Riwayat Transaksi" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Riwayat Transaksi</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Lihat semua transaksi yang telah dilakukan</p>
                        </div>
                    </div>

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-green-700">{flash.success}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-700">{flash.error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter */}
                    <div className="mb-6">
                        <FilterBar
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            onSearch={handleSearch}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* Transactions Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <TransactionTable
                            transactions={transactions}
                            onViewDetail={handleViewDetail}
                            formatCurrency={formatCurrency}
                            formatDate={formatDateTime}
                        />
                    </div>

                    {/* Pagination */}
                    {transactions.data.length > 0 && transactions.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-2">
                                {transactions.links.map((link, index) => {
                                    if (link.url === null) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => router.get(link.url)}
                                            className={`px-3 py-2 rounded-lg transition-colors ${
                                                link.active
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <DetailModal
                isOpen={isModalOpen}
                onClose={closeModal}
                transaction={selectedTransaction}
                formatCurrency={formatCurrency}
                formatDate={formatDateOnly}
            />
        </AuthenticatedLayout>
    );
}