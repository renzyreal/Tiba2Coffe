import React from 'react';
import ProductCard from './ProductCard';

export default function ProductList({ products, onAddToCart, formatCurrency }) {
    return (
        <div className="h-[480px] overflow-y-auto p-3">
            {products.length === 0 ? (
                <div className="text-center text-gray-500 py-10">
                    <p className="text-sm">Tidak ada produk ditemukan</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                            formatCurrency={formatCurrency}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}