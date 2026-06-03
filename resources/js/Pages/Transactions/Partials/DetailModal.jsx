import React, { useState, useEffect } from 'react';
import { X, Printer, CreditCard, User, Calendar, Hash, Loader, FileText } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, transaction, formatCurrency, formatDate }) {
    const [loading, setLoading] = useState(false);
    const [detailData, setDetailData] = useState(null);

    useEffect(() => {
        if (isOpen && transaction?.id) {
            setLoading(true);
            fetch(`/transactions/${transaction.id}`, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return res.json();
                })
                .then(data => {
                    setDetailData(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.error('Error fetching transaction detail:', err);
                    setLoading(false);
                });
        }
    }, [isOpen, transaction]);

    const data = detailData || transaction;

    if (!isOpen) return null;

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'tunai': return 'Tunai';
            case 'qris': return 'QRIS';
            case 'transfer_bank': return 'Transfer Bank';
            default: return method;
        }
    };

    // Format tanggal dengan jam yang konsisten
    const formatDateTime = (date) => {
        if (!date) return '-';
        const d = new Date(date);
        const hari = d.toLocaleDateString('id-ID', { weekday: 'long' });
        const tanggal = d.toLocaleDateString('id-ID', { day: 'numeric' });
        const bulan = d.toLocaleDateString('id-ID', { month: 'long' });
        const tahun = d.toLocaleDateString('id-ID', { year: 'numeric' });
        const jam = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        return `${hari}, ${tanggal} ${bulan} ${tahun} - ${jam}`;
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white dark:bg-gray-800 rounded-lg p-8">
                    <Loader className="w-8 h-8 animate-spin text-red-600 mx-auto" />
                    <p className="mt-2 text-gray-500">Memuat data...</p>
                </div>
            </div>
        );
    }

    if (!data || !data.id) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
                <div className="relative bg-white dark:bg-gray-800 rounded-lg p-8">
                    <p className="text-gray-500">Data tidak ditemukan</p>
                    <button onClick={onClose} className="mt-4 px-4 py-2 bg-red-600 text-white rounded">Tutup</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-[650px] mx-4 max-h-[90vh] overflow-y-auto">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h3 className="text-lg font-medium text-black dark:text-white">Detail Transaksi</h3>
                        <button
                            onClick={onClose}
                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Informasi Transaksi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-start gap-3">
                                <Hash className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">No. Transaksi</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{data.no_transaksi}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tanggal & Waktu</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{formatDateTime(data.created_at)}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Kasir</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{data.user?.name || 'Admin'}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Metode Pembayaran</p>
                                    <p className="text-sm font-medium text-black dark:text-white">{getPaymentMethodLabel(data.metode_pembayaran)}</p>
                                </div>
                            </div>
                            {data.atas_nama && (
                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Atas Nama</p>
                                        <p className="text-sm font-medium text-black dark:text-white">{data.atas_nama}</p>
                                    </div>
                                </div>
                            )}
                            {data.catatan && (
                                <div className="flex items-start gap-3 col-span-2">
                                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Catatan</p>
                                        <p className="text-sm font-medium text-black dark:text-white">{data.catatan}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Daftar Item */}
                        <div className="mb-6">
                            <h4 className="text-sm font-semibold text-black dark:text-white mb-3">Daftar Item</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Produk</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-400">Qty</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Harga</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-400">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                        {(data.details || []).map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-2 text-sm text-black dark:text-white">{item.product?.nama_produk || 'Produk tidak ditemukan'}</td>
                                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-center">{item.jumlah}</td>
                                                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 text-right">{formatCurrency(item.harga)}</td>
                                                <td className="px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-400 text-right">{formatCurrency(item.subtotal)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium">Total</td>
                                            <td className="px-4 py-2 text-right text-base font-bold text-red-600">{formatCurrency(data.total)}</td>
                                        </tr>
                                        <tr className="border-t border-gray-200 dark:border-gray-700">
                                            <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium">Bayar</td>
                                            <td className="px-4 py-2 text-right text-sm font-semibold text-green-600">{formatCurrency(data.bayar)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium">Kembalian</td>
                                            <td className="px-4 py-2 text-right text-sm font-semibold text-blue-600">{formatCurrency(data.kembalian)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => window.open(`/transactions/${data.id}/print`, '_blank')}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"
                            >
                                <Printer className="w-4 h-4" />
                                Cetak Struk
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}