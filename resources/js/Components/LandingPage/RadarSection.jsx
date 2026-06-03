import React from 'react';
import { MapPin, Star, Clock } from 'lucide-react';

export default function RadarSection({ 
    storeAddress, 
    storeWhatsapp, 
    storePhone, 
    storeName,
    mainStoreHours = { open: '08:00', close: '22:00' },
    branchLocations = []
}) {
    // Lokasi Utama
    const mainLocation = {
        time: `${mainStoreHours.open} - ${mainStoreHours.close}`,
        location: storeAddress,
        status: 'Main Store',
        isMain: true
    };

    // Default branch locations jika tidak ada dari parent
    const defaultBranchLocations = [
        {  
            time: '12:00 - 17:00', 
            location: 'Depan Kampus 1 UNG (Depan PascaSarjana)', 
            status: 'Pop-Up'
        },
        {  
            time: '19:00 - 02:00', 
            location: 'Pasar Central (Dekat Jembatan Penyebrangan)', 
            status: 'Pop-Up'
        },
        { 
            time: '19:00 - 02:00', 
            location: 'Taman Limboto (Depan Kantor Bupati)', 
            status: 'Pop-Up'
        },
    ];

    const locations = branchLocations.length > 0 ? branchLocations : defaultBranchLocations;

    return (
        <section id="radar" className="py-20 bg-gray-50 rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
                    {/* Left Side - Info */}
                    <div className="lg:w-1/3">
                        <span className="text-red-600 font-bold text-xs tracking-widest uppercase block mb-2">GPS TRACKER</span>
                        <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900 mb-4">Temukan Booth Kami</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Kami hadir di berbagai lokasi setiap harinya. Pantau jadwal booth mobile kami yang berpindah-pindah!
                        </p>
                        <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="bg-red-600 p-2 rounded-full">
                                    <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <span className="text-xs font-bold text-gray-500 uppercase">Lokasi Utama</span>
                            </div>
                            <p className="text-gray-900 font-semibold">{storeAddress}</p>
                            <p className="text-sm text-gray-500 mt-1">🕐 {mainLocation.time}</p>
                        </div>
                        <a 
                            href={`https://wa.me/${storeWhatsapp}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-2 bg-gray-900 text-white font-black text-xs px-5 py-3 rounded-full tracking-wider uppercase hover:bg-red-600 transition"
                        >
                            📍 Share Live Location Via WA
                        </a>
                    </div>

                    {/* Right Side - Schedule */}
                    <div className="lg:w-2/3 w-full space-y-4">
                        {/* Main Store - Featured */}
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-white border-2 border-red-600 shadow-lg">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-red-600 text-white flex items-center gap-1">
                                            <Star className="h-3 w-3" />
                                            MAIN STORE
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="h-4 w-4 text-red-600" />
                                        <p className="text-base font-bold">{mainLocation.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600 shrink-0">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-bold">⏱ {mainLocation.time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Branch / Pop-Up Locations */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">📍 LOKASI POP-UP & PARTNER</p>
                            {locations.map((item, index) => (
                                <div key={index} className="p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all bg-white border border-gray-200 shadow-sm hover:shadow-md">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-bold px-2 py-1 rounded-full uppercase bg-gray-200 text-gray-600">
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-800 font-semibold">{item.location}</p>
                                    </div>
                                    <div className="text-left sm:text-right font-bold text-sm text-gray-500 shrink-0">
                                        ⏱ {item.time}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Note */}
                        <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-xs text-yellow-700 flex items-center gap-2">
                                <span>ℹ️</span> 
                                Jadwal dapat berubah sewaktu-waktu. Ikuti Instagram kami untuk info terbaru!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}