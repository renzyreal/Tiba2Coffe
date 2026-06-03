import React, { useState, useEffect } from 'react';
import { X, Wallet } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ExpenseForm({ isOpen, onClose, mode, expense }) {
    const [formData, setFormData] = useState({
        tanggal: '',
        kategori_pengeluaran: '',
        nominal: '',
        keterangan: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const kategoriOptions = [
        'Listrik', 'Air', 'Gaji', 'Sewa', 'Bahan Baku', 'Transportasi',
        'Marketing', 'Perawatan', 'Alat Kerja', 'Internet',
        'Makanan & Minuman', 'Perbaikan', 'Pajak',
        'Asuransi', 'Promosi', 'Lainnya'
    ];

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && expense) {
                // Pastikan tanggal diformat dengan benar
                const formattedDate = expense.tanggal 
                    ? new Date(expense.tanggal).toISOString().split('T')[0]
                    : new Date().toISOString().split('T')[0];
                
                setFormData({
                    tanggal: formattedDate,
                    kategori_pengeluaran: expense.kategori_pengeluaran || '',
                    nominal: expense.nominal || '',
                    keterangan: expense.keterangan || ''
                });
            } else if (mode === 'create') {
                resetForm();
            }
        }
    }, [isOpen, mode, expense]);

    const resetForm = () => {
        setFormData({
            tanggal: new Date().toISOString().split('T')[0],
            kategori_pengeluaran: '',
            nominal: '',
            keterangan: ''
        });
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (mode === 'create') {
            router.post('/expenses', formData, {
                onSuccess: () => {
                    handleClose();
                    setLoading(false);
                },
                onError: (err) => {
                    console.error('Error:', err);
                    setErrors(err);
                    setLoading(false);
                }
            });
        } else {
            router.put(`/expenses/${expense.id}`, formData, {
                onSuccess: () => {
                    handleClose();
                    setLoading(false);
                },
                onError: (err) => {
                    console.error('Error:', err);
                    setErrors(err);
                    setLoading(false);
                }
            });
        }
    };

    // Format nominal saat input
    const handleNominalChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        if (value) {
            value = parseInt(value, 10).toString();
            setFormData({ ...formData, nominal: value });
        } else {
            setFormData({ ...formData, nominal: '' });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
            
            <div className="relative w-full max-w-md mx-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                    <form onSubmit={handleSubmit}>
                        <div className="px-6 pt-6 pb-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-5 w-5 text-red-600" />
                                    <h3 className="text-lg font-medium text-black dark:text-white">
                                        {mode === 'create' ? 'Tambah Pengeluaran' : 'Edit Pengeluaran'}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tanggal *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.tanggal}
                                        onChange={(e) => setFormData({ ...formData, tanggal: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    />
                                    {errors.tanggal && <p className="mt-1 text-xs text-red-600">{errors.tanggal}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kategori Pengeluaran *
                                    </label>
                                    <select
                                        value={formData.kategori_pengeluaran}
                                        onChange={(e) => setFormData({ ...formData, kategori_pengeluaran: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategoriOptions.map((kategori) => (
                                            <option key={kategori} value={kategori}>
                                                {kategori}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.kategori_pengeluaran && <p className="mt-1 text-xs text-red-600">{errors.kategori_pengeluaran}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nominal *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nominal ? new Intl.NumberFormat('id-ID').format(formData.nominal) : ''}
                                        onChange={handleNominalChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 text-right"
                                        placeholder="0"
                                    />
                                    {errors.nominal && <p className="mt-1 text-xs text-red-600">{errors.nominal}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Keterangan (Opsional)
                                    </label>
                                    <textarea
                                        value={formData.keterangan}
                                        onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Deskripsi pengeluaran..."
                                    />
                                    {errors.keterangan && <p className="mt-1 text-xs text-red-600">{errors.keterangan}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-2 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Menyimpan...' : (mode === 'create' ? 'Simpan' : 'Update')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}