import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import { Plus, Search, X, Package } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductForm from './Partials/ProductForm';
import DeleteConfirmation from './Partials/DeleteConfirmation';
import ProductCard from './Partials/ProductCard';

export default function Index({ products, categories, filters }) {
    const { flash } = usePage().props;
    const [showProductModal, setShowProductModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modalMode, setModalMode] = useState('create');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [search, setSearch] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.kategori_id || '');

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/products', { search, kategori_id: selectedCategory }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        setSelectedCategory('');
        router.get('/products', {}, { preserveState: true, replace: true });
    };

    const filterByCategory = (categoryId) => {
        setSelectedCategory(categoryId);
        router.get('/products', { search, kategori_id: categoryId }, { preserveState: true, replace: true });
    };

    const openCreateModal = () => {
        setModalMode('create');
        setSelectedProduct(null);
        setShowProductModal(true);
    };

    const openEditModal = (product) => {
        setModalMode('edit');
        setSelectedProduct(product);
        setShowProductModal(true);
    };

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    };

    const handleDelete = () => {
        router.delete(`/products/${selectedProduct.id}`);
        setShowDeleteModal(false);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(value);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Produk" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Manajemen Produk</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Kelola produk, stok, dan harga di sini</p>
                        </div>
                        <button onClick={openCreateModal} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Produk
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
                    
                    {/* Category Filter */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori:</span>
                            <button onClick={() => filterByCategory('')} className={`px-3 py-2 text-sm rounded-full transition-colors ${!selectedCategory ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>Semua</button>
                            {categories.map((category) => (
                                <button key={category.id} onClick={() => filterByCategory(category.id.toString())} className={`px-3 py-2 text-sm rounded-full transition-colors ${selectedCategory == category.id ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>{category.nama_kategori}</button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {products.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
                            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-black dark:text-white mb-2">Belum ada produk</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Mulai dengan menambahkan produk pertama Anda</p>
                            <button onClick={openCreateModal} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
                                <Plus className="w-4 h-4 mr-2" /> Tambah Produk
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                Menampilkan {products.data.length} dari {products.total} produk
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {products.data.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onEdit={openEditModal}
                                        onDelete={openDeleteModal}
                                        formatCurrency={formatCurrency}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                    {/* Pagination */}
                    {products.data.length > 0 && products.last_page > 1 && (
                        <div className="mt-6 flex justify-center space-x-2">
                            {products.links.map((link, index) => link.url === null ? (
                                <span key={index} className="px-3 py-2 rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed" dangerouslySetInnerHTML={{ __html: link.label }} />
                            ) : (
                                <button key={index} onClick={() => router.get(link.url)} className={`px-3 py-2 rounded-lg transition-colors ${link.active ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`} dangerouslySetInnerHTML={{ __html: link.label }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <ProductForm isOpen={showProductModal} onClose={() => setShowProductModal(false)} mode={modalMode} product={selectedProduct} categories={categories} />
            <DeleteConfirmation isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleDelete} title="Hapus Produk" message={`Apakah Anda yakin ingin menghapus produk "${selectedProduct?.nama_produk}"?`} warning="Produk yang dihapus tidak dapat dikembalikan!" />
        </AuthenticatedLayout>
    );
}