import { Link, usePage } from '@inertiajs/react';
import { Coffee, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function GuestLayout({ children }) {
    const { props } = usePage();
    const storeProfile = props.storeProfile || null;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const storeName = storeProfile?.nama_toko || 'KOPI POS';
    const storeLogo = storeProfile?.logo ? `/storage/${storeProfile.logo}` : null;
    const storePhone = storeProfile?.no_telp || '0812 3456 7890';
    const storeEmail = storeProfile?.email || 'support@kopipos.com';
    const storeAddress = storeProfile?.alamat || 'Jl. Sudirman No. 123';
    const storeInstagram = storeProfile?.instagram || '@kopipos';
    const storeFacebook = storeProfile?.facebook || 'kopipos';
    const storeTiktok = storeProfile?.tiktok || '@kopipos';
    const storeWhatsapp = storeProfile?.whatsapp || '081234567890';
    const storeDescription = storeProfile?.deskripsi || 'Solusi POS modern untuk bisnis kopi dan kuliner.';

    // Smooth scroll function
    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white text-gray-900 font-sans antialiased">
            
            {/* ===== NAVBAR (PUTIH - DOMINAN) ===== */}
            <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2 group">
                                {storeLogo ? (
                                    <img src={storeLogo} alt={storeName} className="h-8 w-8 object-cover rounded-full" />
                                ) : (
                                    <div className="bg-red-600 p-1.5 rounded-full">
                                        <Coffee className="h-5 w-5 text-white" />
                                    </div>
                                )}
                                <span className="text-lg font-black tracking-tighter text-gray-900">
                                    {storeName}
                                </span>
                            </Link>
                        </div>
                        
                        {/* Desktop Navigation - Tanpa # */}
                        <div className="hidden md:flex space-x-6 font-semibold text-sm">
                            <button onClick={() => scrollToSection('radar')} className="text-gray-600 hover:text-red-600 transition cursor-pointer">
                                RADAR
                            </button>
                            <button onClick={() => scrollToSection('menu')} className="text-gray-600 hover:text-red-600 transition cursor-pointer">
                                MENU
                            </button>
                            <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-red-600 transition cursor-pointer">
                                MANIFESTO
                            </button>
                            <button onClick={() => scrollToSection('contact')} className="text-gray-600 hover:text-red-600 transition cursor-pointer">
                                KONTAK
                            </button>
                        </div>

                        <div className="hidden md:block">
                            <button onClick={() => scrollToSection('radar')} className="bg-red-600 text-white px-4 py-1.5 text-xs font-bold rounded-full hover:bg-red-700 transition shadow-sm cursor-pointer">
                                CARI BOOTH
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-700 focus:outline-none p-2">
                                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                        <button onClick={() => {
                            scrollToSection('radar');
                            setIsMenuOpen(false);
                        }} className="block w-full text-left py-2 px-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-50">
                            RADAR
                        </button>
                        <button onClick={() => {
                            scrollToSection('menu');
                            setIsMenuOpen(false);
                        }} className="block w-full text-left py-2 px-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-50">
                            MENU
                        </button>
                        <button onClick={() => {
                            scrollToSection('about');
                            setIsMenuOpen(false);
                        }} className="block w-full text-left py-2 px-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-50">
                            MANIFESTO
                        </button>
                        <button onClick={() => {
                            scrollToSection('contact');
                            setIsMenuOpen(false);
                        }} className="block w-full text-left py-2 px-3 rounded-lg text-gray-600 hover:text-red-600 hover:bg-gray-50">
                            KONTAK
                        </button>
                    </div>
                )}
            </nav>

            {/* ===== MAIN CONTENT ===== */}
            <main className="flex-1 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {children}
                </div>
            </main>

            {/* ===== FOOTER ===== */}
            <footer className="bg-black text-white mt-auto">
                {/* Footer Atas */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Brand Column */}
                        <div className="col-span-1">
                            <div className="flex items-center gap-2 mb-4">
                                {storeLogo ? (
                                    <img src={storeLogo} alt={storeName} className="h-10 w-10 object-cover rounded-full border border-red-600" />
                                ) : (
                                    <div className="bg-red-600 p-2 rounded-full">
                                        <Coffee className="h-5 w-5 text-white" />
                                    </div>
                                )}
                                <span className="text-lg font-black tracking-tighter text-white">{storeName}</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {storeDescription}
                            </p>
                            <div className="flex gap-4 mt-6">
                                {storeInstagram && (
                                    <a href={`https://instagram.com/${storeInstagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition text-xs font-bold">
                                        IG
                                    </a>
                                )}
                                {storeFacebook && (
                                    <a href={`https://facebook.com/${storeFacebook}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition text-xs font-bold">
                                        FB
                                    </a>
                                )}
                                {storeTiktok && (
                                    <a href={`https://tiktok.com/@${storeTiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition text-xs font-bold">
                                        TT
                                    </a>
                                )}
                                {storeWhatsapp && (
                                    <a href={`https://wa.me/${storeWhatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition text-xs font-bold">
                                        WA
                                    </a>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-gray-500 mb-4">TENTANG</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition">Tentang Kami</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition">Karir</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-gray-500 mb-4">LAYANAN</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition">Support</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition">Dokumentasi</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-red-500 transition">API</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-xs font-bold tracking-wider text-gray-500 mb-4">KONTAK</h4>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li className="flex items-center gap-2">📞 {storePhone}</li>
                                <li className="flex items-center gap-2">✉️ {storeEmail}</li>
                                <li className="flex items-center gap-2">📍 {storeAddress}</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Bawah */}
                <div className="bg-red-700 py-4">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <p className="text-white text-xs font-mono">
                            © {new Date().getFullYear()} {storeName.toUpperCase()}. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}