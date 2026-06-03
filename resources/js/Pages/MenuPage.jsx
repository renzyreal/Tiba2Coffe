import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { Coffee, Flame, AlertCircle, Search, Filter, X, ChevronLeft } from 'lucide-react';

export default function MenuPage({ allProducts, categories }) {
    const { props } = usePage();
    const storeProfile = props.storeProfile || null;
    const storeName = storeProfile?.nama_toko || 'KOPI POS';
    
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Filter produk
    const filteredProducts = allProducts?.filter(product => {
        const matchesSearch = product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.kategori_id == selectedCategory;
        const matchesStatus = filterStatus === 'all' ? true :
            filterStatus === 'available' ? (product.status === 1 || product.status === true) :
            (product.status === 0 || product.status === false);
        return matchesSearch && matchesCategory && matchesStatus;
    });

    const availableCount = allProducts?.filter(p => p.status === 1 || p.status === true).length || 0;
    const soldOutCount = allProducts?.filter(p => p.status === 0 || p.status === false).length || 0;

    // Reset semua filter
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setFilterStatus('all');
    };

    return (
        <GuestLayout>
            <Head title={`Menu - ${storeName}`} />

            <div className="space-y-8">
                {/* Header */}
                <div className="text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-red-600 transition mb-4">
                        <ChevronLeft className="h-4 w-4" />
                        Kembali ke Beranda
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-gray-900">Menu Kami</h1>
                    <p className="text-gray-500 mt-2">Tersedia {availableCount} produk, {soldOutCount} habis</p>
                </div>

                {/* Filter Section */}
                <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari menu favoritmu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        />
                    </div>

                    {/* Filter Row */}
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-sm font-bold text-gray-500 flex items-center gap-1">
                                <Filter className="h-4 w-4" />
                                Kategori:
                            </span>
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                    selectedCategory === 'all' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            {categories?.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                        selectedCategory === category.id 
                                            ? 'bg-red-600 text-white' 
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {category.nama_kategori}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setFilterStatus('all')}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                    filterStatus === 'all' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Semua
                            </button>
                            <button
                                onClick={() => setFilterStatus('available')}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                    filterStatus === 'available' 
                                        ? 'bg-green-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Tersedia
                            </button>
                            <button
                                onClick={() => setFilterStatus('soldout')}
                                className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                                    filterStatus === 'soldout' 
                                        ? 'bg-red-600 text-white' 
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                Habis
                            </button>
                        </div>
                    </div>

                    {/* Reset Filter */}
                    {(searchTerm || selectedCategory !== 'all' || filterStatus !== 'all') && (
                        <div className="mt-4 text-right">
                            <button
                                onClick={resetFilters}
                                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 ml-auto"
                            >
                                <X className="h-3 w-3" />
                                Reset Filter
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {filteredProducts && filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => {
                            const isBestSeller = product.is_best_seller === true;
                            const isSoldOut = product.status === 0 || product.status === false;
                            
                            return (
                                <div key={product.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-1">
                                    <div className="relative overflow-hidden h-56">
                                        {/* Badge Best Seller */}
                                        {isBestSeller && (
                                            <div className="absolute top-3 left-3 z-10">
                                                <span className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md font-bold">
                                                    <Flame className="h-3 w-3" />
                                                    BEST SELLER
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Gambar */}
                                        {product.gambar ? (
                                            <img 
                                                src={`/storage/${product.gambar}`} 
                                                alt={product.nama_produk} 
                                                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                                <Coffee className="h-16 w-16 text-gray-400" />
                                            </div>
                                        )}
                                        
                                        {/* Badge HABIS */}
                                        {isSoldOut && (
                                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                                <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                                    <AlertCircle className="h-4 w-4" />
                                                    HABIS
                                                </span>
                                            </div>
                                        )}
                                        
                                        {/* Tag Kategori */}
                                        <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white font-bold text-xs px-3 py-1.5 rounded-full">
                                            {product.kategori?.nama_kategori?.toUpperCase() || 'SIGNATURE'}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-black text-gray-900 text-base mb-1 line-clamp-1">{product.nama_produk}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                                            {product.deskripsi || 'Racikan spesial dari kami'}
                                        </p>
                                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-gray-400 text-[10px] font-bold">HARGA NETT</span>
                                            <span className={`text-lg font-black ${isSoldOut ? 'text-gray-400 line-through' : 'text-red-600'}`}>
                                                {formatCurrency(product.harga)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-2xl">
                        <Coffee className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                        <p className="text-gray-500">Tidak ada produk yang ditemukan</p>
                        <button 
                            onClick={resetFilters}
                            className="mt-4 text-red-600 hover:text-red-700 text-sm font-bold"
                        >
                            Reset Filter
                        </button>
                    </div>
                )}

                {/* Total Produk */}
                {filteredProducts && filteredProducts.length > 0 && (
                    <div className="text-center text-sm text-gray-500">
                        Menampilkan {filteredProducts.length} dari {allProducts?.length || 0} produk
                    </div>
                )}
            </div>
        </GuestLayout>
    );
}