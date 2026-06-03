import React, { useState, useEffect } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Calendar, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SummaryCards from './Partials/SummaryCards';
import TransactionDetails from './Partials/TransactionDetails';
import ExpenseDetails from './Partials/ExpenseDetails';
import ClosingHistory from './Partials/ClosingHistory';
import ConfirmModal from './Partials/ConfirmModal';

export default function Index(props) {
    const { 
        date, 
        isClosed, 
        existingClosing, 
        data, 
        transactions, 
        expenses, 
        recent_closings
    } = props;
    
    const { flash } = usePage().props;
    const [selectedDate, setSelectedDate] = useState(date || new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [confirmClosing, setConfirmClosing] = useState(false);
    const [confirmUpdate, setConfirmUpdate] = useState(false);
    const [error, setError] = useState(null);

    // Data default
    const safeData = {
        total_penjualan: data?.total_penjualan ?? 0,
        total_transaksi: data?.total_transaksi ?? 0,
        total_pengeluaran: data?.total_pengeluaran ?? 0,
        pendapatan_bersih: data?.pendapatan_bersih ?? 0,
    };

    const safeRecentClosings = React.useMemo(() => {
        if (!recent_closings) return [];
        return Array.isArray(recent_closings) ? recent_closings : [];
    }, [recent_closings]);

    const safeTransactions = React.useMemo(() => {
        return Array.isArray(transactions) ? transactions : [];
    }, [transactions]);

    const safeExpenses = React.useMemo(() => {
        return Array.isArray(expenses) ? expenses : [];
    }, [expenses]);

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        router.get('/cash-closing', { date: newDate });
    };

    const handleClosing = () => {
        setLoading(true);
        router.post('/cash-closing', {
            tanggal: selectedDate,
            total_penjualan: safeData.total_penjualan,
            total_transaksi: safeData.total_transaksi,
            total_pengeluaran: safeData.total_pengeluaran,
            pendapatan_bersih: safeData.pendapatan_bersih
        }, {
            onSuccess: () => {
                setConfirmClosing(false);
                setLoading(false);
                router.reload();
            },
            onError: (errors) => {
                console.error('Closing error:', errors);
                setError('Gagal melakukan tutup kas');
                setLoading(false);
            }
        });
    };

    const handleUpdate = () => {
        if (!existingClosing || !existingClosing.id) {
            setError('Data tutup kas tidak ditemukan');
            return;
        }
        
        console.log('Updating with data:', {
            id: existingClosing.id,
            total_penjualan: safeData.total_penjualan,
            total_transaksi: safeData.total_transaksi,
            total_pengeluaran: safeData.total_pengeluaran,
            pendapatan_bersih: safeData.pendapatan_bersih
        });
        
        setLoading(true);
        
        router.put(`/cash-closing/${existingClosing.id}`, {
            total_penjualan: safeData.total_penjualan,
            total_transaksi: safeData.total_transaksi,
            total_pengeluaran: safeData.total_pengeluaran,
            pendapatan_bersih: safeData.pendapatan_bersih
        }, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Update success:', response);
                setConfirmUpdate(false);
                setLoading(false);
                // Refresh data dari server
                router.get('/cash-closing', { date: selectedDate }, {
                    preserveState: false,
                    replace: true,
                    onSuccess: () => {
                        console.log('Page reloaded successfully');
                    }
                });
            },
            onError: (errors) => {
                console.error('Update error:', errors);
                setError('Gagal mengupdate tutup kas: ' + (errors.message || 'Unknown error'));
                setLoading(false);
            }
        });
    };

    const formatCurrency = (value) => {
        if (value === null || value === undefined) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(Number(value));
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch {
            return '-';
        }
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return '-';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return '-';
            return date.toLocaleString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return '-';
        }
    };

    const getMetodePembayaranText = (metode) => {
        const methods = {
            'tunai': 'Tunai',
            'qris': 'QRIS',
            'transfer': 'Transfer',
            'credit_card': 'Kartu Kredit',
            'debit_card': 'Kartu Debit'
        };
        return methods[metode] || metode || '-';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Tutup Kas" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
                            <p className="text-sm text-green-700">{flash.success}</p>
                        </div>
                    )}
                    
                    {flash?.error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                            <p className="text-sm text-red-700">{flash.error}</p>
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Tutup Kas</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Lakukan penutupan kas harian</p>
                        </div>
                        <div className="flex items-center gap-3 mt-4 sm:mt-0">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-gray-400" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 text-sm"
                                />
                            </div>
                            
                            {/* Tombol Aksi */}
                            {isToday && !isClosed && (
                                <button
                                    onClick={() => setConfirmClosing(true)}
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                                >
                                    Tutup Kas
                                </button>
                            )}
                            
                            {isToday && isClosed && existingClosing && (
                                <button
                                    onClick={() => setConfirmUpdate(true)}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg shadow-sm transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="h-4 w-4" />
                                    Update
                                </button>
                            )}
                            
                            {!isToday && isClosed && (
                                <div className="px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg cursor-not-allowed">
                                    Sudah Ditutup
                                </div>
                            )}
                            
                            {!isToday && !isClosed && (
                                <div className="px-4 py-2 bg-gray-300 text-gray-600 text-sm font-medium rounded-lg cursor-not-allowed">
                                    Tidak Tersedia
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Status Badge */}
                    <div className="mb-6">
                        {isClosed ? (
                            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800 dark:text-green-300">
                                        Kas Sudah Ditutup
                                        {isToday && (
                                            <span className="ml-2 text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                                                Bisa Update
                                            </span>
                                        )}
                                    </p>
                                    <p className="text-sm text-green-700 dark:text-green-400">
                                        Oleh {existingClosing?.user?.name || 'Admin'} • {formatDateTime(existingClosing?.created_at)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-center gap-3">
                                <AlertCircle className="h-6 w-6 text-yellow-600" />
                                <div>
                                    <p className="font-medium text-yellow-800 dark:text-yellow-300">Kas Belum Ditutup</p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        Silakan tutup kas untuk tanggal {formatDate(selectedDate)}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Summary Cards */}
                    <SummaryCards safeData={safeData} formatCurrency={formatCurrency} />
                    
                    {/* Rincian Transaksi & Pengeluaran */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <TransactionDetails 
                            transactions={safeTransactions}
                            formatCurrency={formatCurrency}
                            getMetodePembayaranText={getMetodePembayaranText}
                            totalPenjualan={safeData.total_penjualan}
                            totalTransaksi={safeData.total_transaksi}
                            selectedDate={selectedDate}
                        />
                        
                        <ExpenseDetails 
                            expenses={safeExpenses}
                            formatCurrency={formatCurrency}
                            totalPengeluaran={safeData.total_pengeluaran}
                            selectedDate={selectedDate}
                        />
                    </div>
                    
                    {/* Riwayat Tutup Kas */}
                    <ClosingHistory 
                        recentClosings={safeRecentClosings}
                        formatCurrency={formatCurrency}
                        formatDate={formatDate}
                        formatDateTime={formatDateTime}
                    />
                    
                    {/* Modal Tutup Kas */}
                    <ConfirmModal 
                        isOpen={confirmClosing}
                        onClose={() => setConfirmClosing(false)}
                        onConfirm={handleClosing}
                        loading={loading}
                        selectedDate={selectedDate}
                        safeData={safeData}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                        title="Konfirmasi Tutup Kas"
                        confirmText="Ya, Tutup Kas"
                        confirmColor="red"
                    />
                    
                    {/* Modal Update */}
                    <ConfirmModal 
                        isOpen={confirmUpdate}
                        onClose={() => setConfirmUpdate(false)}
                        onConfirm={handleUpdate}
                        loading={loading}
                        selectedDate={selectedDate}
                        safeData={safeData}
                        formatDate={formatDate}
                        formatCurrency={formatCurrency}
                        title="Update Tutup Kas"
                        confirmText="Ya, Update"
                        confirmColor="yellow"
                        message="Update data tutup kas dengan transaksi dan pengeluaran terbaru?"
                    />
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}