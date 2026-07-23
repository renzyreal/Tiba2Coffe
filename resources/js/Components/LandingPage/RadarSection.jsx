import React, { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Loader } from 'lucide-react';

export default function RadarSection({ storeWhatsapp }) {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    const fetchLocations = async () => {
        try {
            const response = await fetch('/api/store-locations');
            const data = await response.json();
            setLocations(data);
        } catch (err) {
            setError('Gagal memuat data lokasi');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatJam = (jam) => {
        if (!jam) return '-';
        // Jika formatnya sudah HH:MM, langsung return
        if (jam.length === 5 && jam.includes(':')) return jam;
        // Jika formatnya HH:MM:SS, ambil 5 karakter pertama
        return jam.substring(0, 5);
    };

    // Pisahkan lokasi utama dan cabang
    const mainLocation = locations.find(loc => loc.is_main === true || loc.is_main === 1);
    const branchLocations = locations.filter(loc => loc.is_main !== true && loc.is_main !== 1);

    if (loading) {
        return (
            <section id="radar" className="py-20 bg-gray-50 rounded-3xl">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <Loader className="h-8 w-8 animate-spin text-red-600 mx-auto" />
                    <p className="text-gray-500 mt-2">Memuat data lokasi...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="radar" className="py-20 bg-gray-50 rounded-3xl">
                <div className="max-w-7xl mx-auto px-4 text-center text-red-600">
                    <p>{error}</p>
                </div>
            </section>
        );
    }

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
                        
                        {mainLocation && (
                            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="bg-red-600 p-2 rounded-full">
                                        <MapPin className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 uppercase">Lokasi Utama</span>
                                </div>
                                <p className="text-gray-900 font-semibold">{mainLocation.alamat}</p>
                                <p className="text-sm text-gray-500 mt-1">
                                    🕐 {formatJam(mainLocation.jam_buka)} - {formatJam(mainLocation.jam_tutup)}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">{mainLocation.hari}</p>
                            </div>
                        )}
                        
                        <a 
                            href={`https://wa.me/${storeWhatsapp}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="inline-flex items-center gap-2 bg-gray-900 text-white font-black text-xs px-5 py-3 rounded-full tracking-wider uppercase hover:bg-red-600 transition"
                        >
                            Share Live Location Via WA
                        </a>
                    </div>

                    {/* Right Side - Schedule */}
                    <div className="lg:w-2/3 w-full space-y-4">
                        {/* Main Store - Featured */}
                        {mainLocation && (
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
                                            <p className="text-base font-bold">{mainLocation.nama_lokasi}</p>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{mainLocation.alamat}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 shrink-0">
                                        <Clock className="h-4 w-4" />
                                        <span className="font-bold">⏱ {formatJam(mainLocation.jam_buka)} - {formatJam(mainLocation.jam_tutup)}</span>
                                    </div>
                                </div>
                                <div className="mt-2 text-xs text-gray-400">
                                    {mainLocation.hari} • {mainLocation.deskripsi}
                                </div>
                            </div>
                        )}

                        {/* Branch / Pop-Up Locations */}
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2">LOKASI POP-UP & PARTNER</p>
                            {branchLocations.length > 0 ? (
                                branchLocations.map((item) => (
                                    <div key={item.id} className="p-5 rounded-2xl flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all bg-white border border-gray-200 shadow-sm hover:shadow-md">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                                    item.status === 'active' 
                                                        ? 'bg-green-100 text-green-700' 
                                                        : item.status === 'holiday' 
                                                            ? 'bg-red-100 text-red-700' 
                                                            : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {item.status === 'active' ? 'Buka' : item.status === 'holiday' ? 'Libur' : 'Tutup'}
                                                </span>
                                                <span className="text-xs text-gray-400">{item.hari}</span>
                                            </div>
                                            <p className="text-gray-800 font-semibold">{item.nama_lokasi}</p>
                                            <p className="text-xs text-gray-500 mt-1">{item.alamat}</p>
                                            {item.deskripsi && (
                                                <p className="text-xs text-gray-400 mt-1">{item.deskripsi}</p>
                                            )}
                                        </div>
                                        <div className="text-left sm:text-right font-bold text-sm text-gray-500 shrink-0">
                                            ⏱ {formatJam(item.jam_buka)} - {formatJam(item.jam_tutup)}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-4 text-gray-400 text-sm">
                                    Belum ada lokasi pop-up
                                </div>
                            )}
                        </div>

                        {/* Note */}
                        <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                            <p className="text-xs text-yellow-700 flex items-center gap-2"> 
                                Jadwal dapat berubah sewaktu-waktu. Ikuti Instagram kami untuk info terbaru!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}