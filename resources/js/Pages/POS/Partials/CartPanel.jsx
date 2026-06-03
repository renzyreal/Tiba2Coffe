import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, CreditCard, QrCode, Landmark, Receipt, AlertCircle, User, FileText } from 'lucide-react';
import CartItem from './CartItem';

export default function CartPanel({ cart, onUpdateQuantity, onRemove, onClearCart, onCheckout, formatCurrency, resetTrigger }) {
    const [paymentMethod, setPaymentMethod] = useState('tunai');
    const [paymentAmount, setPaymentAmount] = useState('');
    const [atasNama, setAtasNama] = useState('');
    const [catatan, setCatatan] = useState('');
    const [atasNamaError, setAtasNamaError] = useState('');

    const total = cart.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
    const paymentValue = parseFloat(paymentAmount) || 0;
    const isPaymentValid = paymentValue >= total;
    const kekurangan = total - paymentValue;
    const kembalian = paymentValue - total;

    // Reset semua form saat transaksi selesai (cart kosong)
    useEffect(() => {
        if (cart.length === 0) {
            setPaymentMethod('tunai');
            setPaymentAmount('');
            setAtasNama('');
            setCatatan('');
            setAtasNamaError('');
        }
    }, [cart.length]);

    // Reset juga saat resetTrigger berubah
    useEffect(() => {
        if (resetTrigger) {
            setPaymentMethod('tunai');
            setPaymentAmount('');
            setAtasNama('');
            setCatatan('');
            setAtasNamaError('');
        }
    }, [resetTrigger]);

    const handleCheckout = () => {
        // Validasi atas nama wajib diisi
        if (!atasNama.trim()) {
            setAtasNamaError('Atas nama wajib diisi');
            return;
        }
        setAtasNamaError('');
        
        if (cart.length === 0) {
            alert('Keranjang belanja kosong!');
            return;
        }
        if (paymentMethod === 'tunai' && (!paymentAmount || paymentValue < total)) {
            alert(`Pembayaran kurang ${formatCurrency(kekurangan)}`);
            return;
        }
        onCheckout({ paymentMethod, paymentAmount: paymentValue, total, atasNama, catatan });
    };

    const handlePaymentChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        setPaymentAmount(value ? parseInt(value, 10).toString() : '');
    };

    // Reset form manual
    const resetForm = () => {
        setPaymentMethod('tunai');
        setPaymentAmount('');
        setAtasNama('');
        setCatatan('');
        setAtasNamaError('');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm flex flex-col h-[600px]">
            {/* Header */}
            <div className="flex-shrink-0 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                    <h2 className="text-sm font-semibold">Keranjang</h2>
                    {cart.length > 0 && (
                        <div className="flex gap-2">
                            <button onClick={onClearCart} className="text-red-500 text-xs flex items-center gap-1">
                                <Trash2 className="h-3 w-3" /> Kosongkan
                            </button>
                        </div>
                    )}
                </div>
                {cart.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">{cart.length} item</p>
                )}
            </div>

            {/* Items - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 p-2 space-y-2">
                {cart.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        <ShoppingCart className="h-10 w-10 mx-auto mb-2" />
                        <p className="text-sm">Keranjang kosong</p>
                    </div>
                ) : (
                    cart.map((item) => (
                        <CartItem
                            key={item.id}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemove={onRemove}
                            formatCurrency={formatCurrency}
                        />
                    ))
                )}
            </div>

            {/* Summary - Fixed bottom */}
            {cart.length > 0 && (
                <div className="flex-shrink-0 border-t p-3 space-y-2 bg-white dark:bg-gray-800">
                    {/* Atas Nama - WAJIB */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            Atas Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={atasNama}
                            onChange={(e) => {
                                setAtasNama(e.target.value);
                                if (atasNamaError) setAtasNamaError('');
                            }}
                            placeholder="Masukkan nama customer"
                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-1 focus:ring-red-500 ${
                                atasNamaError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                        />
                        {atasNamaError && (
                            <p className="text-xs text-red-500">{atasNamaError}</p>
                        )}
                    </div>

                    {/* Catatan - Opsional */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            Catatan (Opsional)
                        </label>
                        <textarea
                            value={catatan}
                            onChange={(e) => setCatatan(e.target.value)}
                            placeholder="Catatan untuk transaksi ini..."
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-1 focus:ring-red-500 resize-none"
                        />
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center pt-2">
                        <span className="text-sm text-gray-600">Total</span>
                        <span className="text-base font-bold text-red-600">{formatCurrency(total)}</span>
                    </div>

                    {/* Payment Method */}
                    <div className="flex gap-1">
                        {[
                            { id: 'tunai', icon: CreditCard, label: 'Tunai' },
                            { id: 'qris', icon: QrCode, label: 'QRIS' },
                            { id: 'transfer_bank', icon: Landmark, label: 'Transfer' }
                        ].map((method) => (
                            <button
                                key={method.id}
                                onClick={() => {
                                    setPaymentMethod(method.id);
                                    setPaymentAmount(method.id === 'tunai' ? '' : total.toString());
                                }}
                                className={`flex-1 py-2 rounded text-xs font-medium transition-colors ${
                                    paymentMethod === method.id
                                        ? 'bg-red-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700'
                                }`}
                            >
                                <method.icon className="h-3.5 w-3.5 mx-auto mb-0.5" />
                                {method.label}
                            </button>
                        ))}
                    </div>

                    {/* Payment Input */}
                    {paymentMethod === 'tunai' && (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={paymentAmount ? formatCurrency(parseInt(paymentAmount)) : ''}
                                onChange={handlePaymentChange}
                                placeholder="Jumlah bayar"
                                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-red-500 text-right"
                            />
                            
                            {paymentAmount && (
                                <div className={`p-2 rounded text-xs ${
                                    isPaymentValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                    <div className="flex justify-between">
                                        <span>{isPaymentValid ? 'Kembalian' : <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Kurang</span>}</span>
                                        <span className="font-bold">{isPaymentValid ? formatCurrency(kembalian) : formatCurrency(kekurangan)}</span>
                                    </div>
                                </div>
                            )}
                            
                            {!paymentAmount && (
                                <div className="flex gap-2">
                                    <button onClick={() => setPaymentAmount(Math.ceil(total / 1000) * 1000)} className="flex-1 py-2 text-xs bg-gray-100 rounded-lg">Bulatkan</button>
                                    <button onClick={() => setPaymentAmount(total)} className="flex-1 py-2 text-xs bg-gray-100 rounded-lg">Pas</button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Non-Cash Info */}
                    {(paymentMethod === 'qris' || paymentMethod === 'transfer_bank') && (
                        <div className="p-2 bg-blue-50 rounded-lg text-center text-xs text-blue-700">
                            Bayar: <span className="font-bold">{formatCurrency(total)}</span>
                        </div>
                    )}

                    {/* Checkout Button */}
                    <button
                        onClick={handleCheckout}
                        disabled={paymentMethod === 'tunai' && paymentAmount && !isPaymentValid}
                        className={`w-full py-2 text-white font-medium rounded-lg text-sm ${
                            paymentMethod === 'tunai' && paymentAmount && !isPaymentValid
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700'
                        }`}
                    >
                        <Receipt className="h-4 w-4 inline mr-1" />
                        {paymentMethod === 'tunai' && paymentAmount && !isPaymentValid
                            ? `Kurang ${formatCurrency(kekurangan)}`
                            : 'Bayar'}
                    </button>
                </div>
            )}
        </div>
    );
}