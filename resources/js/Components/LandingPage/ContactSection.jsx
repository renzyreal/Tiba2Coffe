import React from 'react';

export default function ContactSection({ storeName, storeInstagram, storeWhatsapp }) {
    return (
        <section id="contact" className="border-t border-gray-200 bg-white py-12 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
                <div>
                    <p className="text-gray-900 text-sm mb-1 font-semibold">Punya Event / Kolaborasi Komunitas?</p>
                    <p className="text-gray-500 font-light text-sm">Bawa booth {storeName} ke gig, pameran, atau tempat nongkrong lo.</p>
                </div>
                <div className="flex gap-4">
                    {storeInstagram && (
                        <a href={`https://instagram.com/${storeInstagram.replace('@', '')}`} className="bg-gray-900 text-white px-5 py-2 rounded-full hover:bg-red-600 transition text-sm font-semibold">
                            INSTAGRAM
                        </a>
                    )}
                    {storeWhatsapp && (
                        <a href={`https://wa.me/${storeWhatsapp}`} className="border-2 border-gray-300 text-gray-700 px-5 py-2 rounded-full hover:border-red-600 hover:text-red-600 transition text-sm font-semibold">
                            WHATSAPP
                        </a>
                    )}
                </div>
            </div>
        </section>
    );
}