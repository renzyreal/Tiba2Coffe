import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Search, X, Package, FolderOpen } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CategoryCard from './Partials/CategoryCard';
import DeleteConfirmation from './Partials/DeleteConfirmation';

export default function Index({ categories, filters }) {
    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        nama_kategori: '',
        deskripsi: ''
    });
    const [search, setSearch] = useState(filters.search || '');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/categories', { search }, {
            preserveState: true,
            replace: true
        });
    };

    const resetSearch = () => {
        setSearch('');
        router.get('/categories', {}, {
            preserveState: true,
            replace: true
        });
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedCategory(null);
        setFormData({ nama_kategori: '', deskripsi: '' });
        setErrors({});
        setShowModal(true);
    };

    const openEditModal = (category) => {
        setModalMode('edit');
        setSelectedCategory(category);
        setFormData({
            nama_kategori: category.nama_kategori || '',
            deskripsi: category.deskripsi || ''
        });
        setErrors({});
        setShowModal(true);
    };

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setShowDeleteModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        if (modalMode === 'create') {
            router.post('/categories', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                    setLoading(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setLoading(false);
                }
            });
        } else {
            router.put(`/categories/${selectedCategory.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                    setLoading(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setLoading(false);
                }
            });
        }
    };

    const handleDelete = () => {
        router.delete(`/categories/${selectedCategory.id}`);
        setShowDeleteModal(false);
    };

    const resetForm = () => {
        setFormData({ nama_kategori: '', deskripsi: '' });
        setSelectedCategory(null);
        setErrors({});
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    // Handle ESC key
    React.useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && showModal) {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [showModal]);

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Kategori" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Manajemen Kategori</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola kategori produk Anda di sini</p>
                        </div>
                        <button onClick={openCreateModal} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
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
                    
                    {/* Categories Grid */}
                    {categories.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                            <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-black dark:text-white mb-2">Belum ada kategori</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Mulai dengan menambahkan kategori pertama Anda</p>
                            <button onClick={openCreateModal} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Kategori
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan {categories.data.length} dari {categories.total} kategori
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {categories.data.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Pagination */}
                    {categories.data.length > 0 && categories.last_page > 1 && (
                        <div className="mt-6 flex justify-center space-x-2">
                            {categories.links.map((link, index) => link.url === null ? (
                                <span key={index} className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <button key={index} onClick={() => router.get(link.url)} className={`px-3 py-2 rounded-lg transition-colors ${link.active ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Perfectly Centered */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleBackdropClick}>
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
                    
                    <div className="relative w-full max-w-md mx-4">
                        <div className="transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-xl transition-all">
                            <form onSubmit={handleSubmit}>
                                <div className="px-6 pt-6 pb-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-black dark:text-white">
                                            {modalMode === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori'}
                                        </h3>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Nama Kategori *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.nama_kategori}
                                                onChange={(e) => setFormData({ ...formData, nama_kategori: e.target.value })}
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                                placeholder="Contoh: Elektronik, Pakaian, Makanan"
                                                autoFocus
                                            />
                                            {errors.nama_kategori && <p className="mt-1 text-xs text-red-600">{errors.nama_kategori}</p>}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Deskripsi (Opsional)
                                            </label>
                                            <textarea
                                                value={formData.deskripsi}
                                                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                                                rows="3"
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                                placeholder="Deskripsi singkat tentang kategori ini..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-2 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
                                    >
                                        {loading ? 'Menyimpan...' : (modalMode === 'create' ? 'Simpan' : 'Update')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Hapus Kategori"
                message={`Apakah Anda yakin ingin menghapus kategori "${selectedCategory?.nama_kategori}"?`}
                warning="Kategori yang dihapus tidak dapat dikembalikan!"
            />
        </AuthenticatedLayout>
    );
}