import React from 'react';
import { Link } from '@inertiajs/react';
import { Coffee, Flame, AlertCircle, ArrowRight } from 'lucide-react';

export default function MenuSection({ popularProducts, formatCurrency }) {
    // Ambil 4 produk terlaris
    const streetMenu = popularProducts?.length > 0 ? popularProducts.slice(0, 4).map(product => ({
        id: product.id,
        name: product.nama_produk.toUpperCase(),
        price: formatCurrency(product.harga),
        tag: product.kategori?.nama_kategori?.toUpperCase() || 'SIGNATURE',
        desc: product.deskripsi || 'Racikan spesial dari kami',
        img: product.gambar ? `/storage/${product.gambar}` : null,
        isBestSeller: product.is_best_seller === true,
        isSoldOut: product.status === 0 || product.status === false
    })) : [];

    if (streetMenu.length === 0) return null;

    return (
        <section id="menu" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
                <div className="border-l-4 border-red-600 pl-4">
                    <span className="text-gray-500 font-bold text-xs tracking-widest uppercase block mb-1">STREET FUEL</span>
                    <h2 className="text-4xl font-black uppercase tracking-tighter text-gray-900">MENU ANTI LEMAH</h2>
                </div>
                
                {/* Tombol Lihat Semua Menu */}
                <Link 
                    href="/menu" 
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-red-600 transition font-semibold text-sm group"
                >
                    Lihat Semua Menu
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {streetMenu.map((item, index) => (
                    <div key={item.id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:-translate-y-1">
                        <div className="relative overflow-hidden h-56">
                            {/* Badge Best Seller di pojok kiri atas */}
                            {item.isBestSeller && (
                                <div className="absolute top-3 left-3 z-10">
                                    <span className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md font-bold">
                                        <Flame className="h-3 w-3" />
                                        BEST SELLER
                                    </span>
                                </div>
                            )}
                            
                            {/* Gambar atau placeholder */}
                            {item.img ? (
                                <img 
                                    src={item.img} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                                    <Coffee className="h-16 w-16 text-gray-400" />
                                </div>
                            )}
                            
                            {/* Badge HABIS di tengah gambar */}
                            {item.isSoldOut && (
                                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                    <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4" />
                                        HABIS
                                    </span>
                                </div>
                            )}
                            
                            {/* Tag kategori di pojok kanan atas */}
                            <div className="absolute top-3 right-3 z-10 bg-black/70 backdrop-blur-sm text-white font-bold text-xs px-3 py-1.5 rounded-full">
                                {item.tag}
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-black text-gray-900 text-base mb-1 line-clamp-1">{item.name}</h3>
                            <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
                            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-gray-400 text-[10px] font-bold">HARGA NETT</span>
                                <span className={`text-lg font-black ${item.isSoldOut ? 'text-gray-400 line-through' : 'text-red-600'}`}>
                                    {item.price}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}