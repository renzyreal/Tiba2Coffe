import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Wallet, TrendingUp, Calendar } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FilterBar from './Partials/FilterBar';
import ExpenseTable from './Partials/ExpenseTable';
import ExpenseForm from './Partials/ExpenseForm';
import DeleteConfirmation from './Partials/DeleteConfirmation';

export default function Index({ expenses, totalExpense, categorySummary, filters, categories }) {
    const { flash } = usePage().props;
    const [showFormModal, setShowFormModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedExpense, setSelectedExpense] = useState(null);
    const [startDate, setStartDate] = useState(filters.start_date || '');
    const [endDate, setEndDate] = useState(filters.end_date || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.kategori || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/expenses', { 
            start_date: startDate, 
            end_date: endDate,
            kategori: selectedCategory 
        }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedCategory('');
        router.get('/expenses', {}, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedExpense(null);
        setShowFormModal(true);
    };

    const openEditModal = (expense) => {
        setModalMode('edit');
        setSelectedExpense(expense);
        setShowFormModal(true);
    };

    const openDeleteModal = (expense) => {
        setSelectedExpense(expense);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(`/expenses/${selectedExpense.id}`);
        setShowDeleteModal(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengeluaran" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Manajemen Pengeluaran</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola semua pengeluaran toko</p>
                        </div>
                        <button 
                            onClick={openCreateModal}
                            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Tambah Pengeluaran
                        </button>
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

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Pengeluaran</p>
                                    <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpense)}</p>
                                </div>
                                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                                    <Wallet className="h-6 w-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Jumlah Transaksi</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{expenses.total}</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Rata-rata per Transaksi</p>
                                    <p className="text-2xl font-bold text-gray-800 dark:text-white">
                                        {expenses.total > 0 ? formatCurrency(totalExpense / expenses.total) : formatCurrency(0)}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Category Summary */}
                    {categorySummary.length > 0 && (
                        <div className="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
                            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Ringkasan per Kategori</h3>
                            <div className="flex flex-wrap gap-2">
                                {categorySummary.map((cat, index) => (
                                    <div key={index} className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
                                        <span className="font-medium">{cat.kategori_pengeluaran}</span>
                                        <span className="ml-2 text-red-600 font-semibold">{formatCurrency(cat.total)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="mb-4">
                        <FilterBar
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            categories={categories}
                            onSearch={handleSearch}
                            onReset={resetFilters}
                        />
                    </div>

                    {/* Expenses Table */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                        <ExpenseTable
                            expenses={expenses}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                            formatCurrency={formatCurrency}
                            formatDate={formatDate}
                        />
                    </div>

                    {/* Pagination */}
                    {expenses.data.length > 0 && expenses.last_page > 1 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex space-x-2">
                                {expenses.links.map((link, index) => {
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

            {/* Modals */}
            <ExpenseForm
                isOpen={showFormModal}
                onClose={() => setShowFormModal(false)}
                mode={modalMode}
                expense={selectedExpense}
            />

            <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Hapus Pengeluaran"
                message={`Apakah Anda yakin ingin menghapus pengeluaran "${selectedExpense?.kategori_pengeluaran}" sebesar ${formatCurrency(selectedExpense?.nominal)}?`}
                warning="Data yang dihapus tidak dapat dikembalikan!"
            />
        </AuthenticatedLayout>
    );
}