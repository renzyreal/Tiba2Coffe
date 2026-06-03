import React from 'react';

export default function ManifestoSection({ storeName }) {
    return (
        <section id="about" className="py-20 bg-gray-900 text-white relative overflow-hidden rounded-3xl">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 text-[12rem] font-black tracking-tighter select-none pointer-events-none uppercase hidden lg:block opacity-20">
                RAW COFFEE
            </div>
            <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
                <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tighter mb-8">
                    MANIFESTO JALANAN:<br />KICK OUT THE FANCY STUFF.
                </h2>
                <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-6">
                    Kami males sama kafe estetik yang jualan tempat mahal tapi rasa kopinya hambar. Di <strong className="text-red-400">{storeName}</strong>, fokus kami cuma satu: menyajikan ekstraksi kafein mentah, kuat, jujur, langsung di aspal kota. 
                </p>
                <p className="text-red-400 text-sm font-black uppercase tracking-wider">
                    ⚡ BOOTH BONGKAR PASANG. ENERGI MAKSIMAL. NO COMPROMISE.
                </p>
            </div>
        </section>
    );
}