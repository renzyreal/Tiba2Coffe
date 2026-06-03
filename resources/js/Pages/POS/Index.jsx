import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Search, X } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ProductList from './Partials/ProductList';
import CartPanel from './Partials/CartPanel';
import CheckoutModal from './Partials/CheckoutModal';
import SuccessModal from './Partials/SuccessModal';

export default function Index({ products }) {
    const [cart, setCart] = useState([]);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [checkoutData, setCheckoutData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [lastTransactionId, setLastTransactionId] = useState(null);
    const [lastTransactionNo, setLastTransactionNo] = useState(null);

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nama_produk.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || product.kategori_id == selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Get unique categories
    const categoryList = [...new Map(products.map(p => [p.kategori_id, p.kategori])).values()].filter(Boolean);

    const total = cart.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);

    const addToCart = (product, qty = 1) => {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === product.id 
                    ? { ...item, jumlah: item.jumlah + qty, subtotal: item.harga * (item.jumlah + qty) }
                    : item
            ));
        } else {
            setCart([...cart, {
                id: product.id,
                nama_produk: product.nama_produk,
                harga: product.harga,
                jumlah: qty,
                subtotal: product.harga * qty,
                gambar: product.gambar,
                kategori: product.kategori?.nama_kategori
            }]);
        }
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(cart.map(item => 
            item.id === productId 
                ? { ...item, jumlah: newQuantity, subtotal: item.harga * newQuantity }
                : item
        ));
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        if (confirm('Hapus semua item dari keranjang?')) {
            setCart([]);
        }
    };

    const handleCheckout = (data) => {
        setCheckoutData(data);
        setShowCheckoutModal(true);
    };

    const processTransaction = () => {
        if (!checkoutData) return;
        
        setLoading(true);

        const transactionData = {
            items: cart.map(item => ({
                product_id: item.id,
                jumlah: item.jumlah,
                harga: item.harga,
            })),
            total: checkoutData.total,
            bayar: checkoutData.paymentAmount,
            metode_pembayaran: checkoutData.paymentMethod,
            atas_nama: checkoutData.atasNama,
            catatan: checkoutData.catatan,
        };

        fetch('/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                'Accept': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                setCart([]);
                setShowCheckoutModal(false);
                setLastTransactionId(data.transaction_id);
                setLastTransactionNo(data.transaction_no);
                setShowSuccessModal(true);
            } else {
                alert(data.message || 'Terjadi kesalahan');
            }
            setLoading(false);
        })
        .catch(error => {
            console.error(error);
            alert('Terjadi kesalahan, silakan coba lagi');
            setLoading(false);
        });
    };

    const handlePrint = () => {
        if (lastTransactionId) {
            window.open(`/transactions/${lastTransactionId}/print`, '_blank');
        }
    };

    const closeSuccessModal = () => {
        setShowSuccessModal(false);
        setLastTransactionId(null);
        setLastTransactionNo(null);
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
            <Head title="Point of Sale" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black dark:text-white">Point of Sale</h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Pilih produk dan lakukan transaksi</p>
                        </div>
                    </div>
                    
                    

                    {/* Main Content - Responsive Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Product List - 2/3 width di desktop */}
                        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                            
                            {/* Category Filter */}
                            <div className="m-4">
                                <div className="flex flex-wrap gap-2 items-center">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Kategori:</span>
                                    <button 
                                        onClick={() => setSelectedCategory('all')} 
                                        className={`px-3 py-2 text-sm rounded-full transition-colors ${selectedCategory === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                                    >
                                        Semua
                                    </button>
                                    {categoryList.map((category) => (
                                        <button 
                                            key={category.id} 
                                            onClick={() => setSelectedCategory(category.id)} 
                                            className={`px-3 py-2 text-sm rounded-full transition-colors ${selectedCategory === category.id ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}
                                        >
                                            {category.nama_kategori}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ProductList
                                products={filteredProducts}
                                onAddToCart={addToCart}
                                formatCurrency={formatCurrency}
                            />
                        </div>
                        
                        {/* Cart Panel - 1/3 width di desktop */}
                        <div className="lg:col-span-1">
                            <CartPanel
                                cart={cart}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                                onClearCart={clearCart}
                                onCheckout={handleCheckout}
                                formatCurrency={formatCurrency}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                onConfirm={processTransaction}
                transaction={checkoutData || { total: 0, paymentMethod: 'tunai', paymentAmount: 0 }}
                formatCurrency={formatCurrency}
                loading={loading}
            />

            <SuccessModal
                isOpen={showSuccessModal}
                onClose={closeSuccessModal}
                onPrint={handlePrint}
                message="Transaksi berhasil!"
                transactionId={lastTransactionId}
                transactionNo={lastTransactionNo}
            />
        </AuthenticatedLayout>
    );
}