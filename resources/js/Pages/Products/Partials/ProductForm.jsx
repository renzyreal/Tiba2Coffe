import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function ProductForm({ isOpen, onClose, mode, product, categories }) {
    const [formData, setFormData] = useState({
        kategori_id: '',
        nama_produk: '',
        harga: '',
        status: true,
        gambar: null
    });
    const [previewUrl, setPreviewUrl] = useState(null);
    const [removeExistingImage, setRemoveExistingImage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isOpen) {
            if (mode === 'edit' && product) {
                setFormData({
                    kategori_id: product.kategori_id || '',
                    nama_produk: product.nama_produk || '',
                    harga: product.harga || '',
                    status: product.status === 1 || product.status === true,
                    gambar: null
                });
                if (product.gambar) {
                    setPreviewUrl(`/storage/${product.gambar}`);
                } else {
                    setPreviewUrl(null);
                }
                setRemoveExistingImage(false);
            } else if (mode === 'create') {
                resetForm();
            }
        }
    }, [isOpen, mode, product]);

    const resetForm = () => {
        setFormData({
            kategori_id: '',
            nama_produk: '',
            harga: '',
            status: true,
            gambar: null
        });
        setPreviewUrl(null);
        setRemoveExistingImage(false);
        setErrors({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setErrors({ ...errors, gambar: 'Format gambar harus JPG, PNG, GIF, atau WEBP' });
                return;
            }
            
            if (file.size > 2 * 1024 * 1024) {
                setErrors({ ...errors, gambar: 'Ukuran gambar maksimal 2MB' });
                return;
            }
            
            setFormData({ ...formData, gambar: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
            
            setRemoveExistingImage(false);
            
            if (errors.gambar) {
                setErrors({ ...errors, gambar: null });
            }
        }
    };

    const handleRemoveImage = () => {
        if (confirm('Hapus gambar produk ini?')) {
            setPreviewUrl(null);
            setFormData({ ...formData, gambar: null });
            setRemoveExistingImage(true);
            
            const fileInput = document.getElementById('gambar_input');
            if (fileInput) fileInput.value = '';
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        const data = new FormData();
        data.append('kategori_id', formData.kategori_id);
        data.append('nama_produk', formData.nama_produk);
        data.append('harga', formData.harga);
        data.append('status', formData.status ? '1' : '0');
        
        if (formData.gambar && typeof formData.gambar !== 'string') {
            data.append('gambar', formData.gambar);
        } else if (removeExistingImage) {
            data.append('remove_image', '1');
        }

        if (mode === 'create') {
            router.post('/products', data, {
                onSuccess: () => {
                    handleClose();
                    setLoading(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setLoading(false);
                }
            });
        } else {
            data.append('_method', 'PUT');
            router.post(`/products/${product.id}`, data, {
                onSuccess: () => {
                    handleClose();
                    setLoading(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setLoading(false);
                }
            });
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
                                <h3 className="text-lg font-medium text-black dark:text-white">
                                    {mode === 'create' ? 'Tambah Produk Baru' : 'Edit Produk'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Gambar Produk
                                    </label>
                                    
                                    {previewUrl ? (
                                        <div className="relative inline-block mb-3">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="h-32 w-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                                            />
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
                                                title="Hapus gambar"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div 
                                            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-red-500 transition-colors cursor-pointer"
                                            onClick={() => document.getElementById('gambar_input').click()}
                                        >
                                            <div className="space-y-1 text-center">
                                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium text-red-600 hover:text-red-500">
                                                        Klik untuk upload
                                                    </span>
                                                    <p className="pl-1">atau drag and drop</p>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG, GIF, WEBP up to 2MB
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <input
                                        id="gambar_input"
                                        type="file"
                                        className="hidden"
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleImageChange}
                                    />
                                    
                                    {errors.gambar && (
                                        <p className="mt-1 text-sm text-red-600">{errors.gambar}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Kategori *
                                    </label>
                                    <select
                                        value={formData.kategori_id}
                                        onChange={(e) => setFormData({ ...formData, kategori_id: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {categories && categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.nama_kategori}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.kategori_id && <p className="mt-1 text-xs text-red-600">{errors.kategori_id}</p>}
                                </div>

                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Nama Produk *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.nama_produk}
                                        onChange={(e) => setFormData({ ...formData, nama_produk: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="Contoh: Kopi Arabica"
                                        autoFocus
                                    />
                                    {errors.nama_produk && <p className="mt-1 text-xs text-red-600">{errors.nama_produk}</p>}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Harga *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.harga}
                                        onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
                                        required
                                        min="0"
                                        step="1000"
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                                        placeholder="0"
                                    />
                                    {errors.harga && <p className="mt-1 text-xs text-red-600">{errors.harga}</p>}
                                </div>

                                {/* Status */}
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="status"
                                        checked={formData.status === true || formData.status === 1 || formData.status === '1'}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                                        className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 focus:ring-2"
                                    />
                                    <label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Produk Aktif
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
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