import React from 'react';

export default function HeroSection({ storeName, storeLogo, storeDescription }) {
    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-start overflow-hidden bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-3xl shadow-xl">
            <div className="absolute inset-0 z-0 opacity-5">
                <img 
                    src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1920" 
                    alt="Street vibe" 
                    className="w-full h-full object-cover"
                />
            </div>
            
            <div className="relative z-10 max-w-4xl w-full py-12 px-8">
                <div className="inline-block bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest mb-6 animate-pulse">
                    MOVING BOOTH - STREET CAFFEINE FIX
                </div>
                <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-gray-900 mb-6">
                    {storeName.toUpperCase()}.<br />
                    PEKAT.<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">DI JALANAN.</span>
                </h1>
                <p className="text-gray-600 text-base sm:text-lg max-w-xl mb-10 font-light">
                    {storeDescription}
                </p>
                <div className="flex flex-wrap gap-4 uppercase text-xs font-bold">
                    <a href="#radar" className="bg-red-600 text-white px-6 py-4 rounded-full hover:bg-red-700 transition shadow-lg">
                        Lacak Lokasi →
                    </a>
                    <a href="#menu" className="border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-full hover:border-red-600 hover:text-red-600 transition">
                        Cek Menu
                    </a>
                </div>
            </div>
        </section>
    );
}