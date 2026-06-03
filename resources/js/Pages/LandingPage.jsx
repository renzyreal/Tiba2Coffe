import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import HeroSection from '@/Components/LandingPage/HeroSection';
import RadarSection from '@/Components/LandingPage/RadarSection';
import MenuSection from '@/Components/LandingPage/MenuSection';
import ManifestoSection from '@/Components/LandingPage/ManifestoSection';
import ContactSection from '@/Components/LandingPage/ContactSection';

export default function LandingPage({ allProducts, featuredProducts, categories, popularProducts }) {
    const { props } = usePage();
    const storeProfile = props.storeProfile || null;
    
    const storeName = storeProfile?.nama_toko || 'KOPI POS';
    const storeLogo = storeProfile?.logo ? `/storage/${storeProfile.logo}` : null;
    const storePhone = storeProfile?.no_telp || '0812 3456 7890';
    const storeEmail = storeProfile?.email || 'support@kopipos.com';
    const storeAddress = storeProfile?.alamat || 'Jl. Sudirman No. 123';
    const storeInstagram = storeProfile?.instagram || '@kopipos';
    const storeWhatsapp = storeProfile?.whatsapp || '081234567890';
    const storeDescription = storeProfile?.deskripsi || 'Solusi POS modern untuk bisnis kopi dan kuliner.';

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    return (
        <GuestLayout>
            <Head title={`${storeName} - Street Caffeine Fix`} />

            <div className="space-y-8">
                <HeroSection 
                    storeName={storeName} 
                    storeLogo={storeLogo} 
                    storeDescription={storeDescription} 
                />
                
                <RadarSection 
                    storeAddress={storeAddress} 
                    storeWhatsapp={storeWhatsapp} 
                />
                
                <MenuSection 
                    popularProducts={popularProducts} 
                    formatCurrency={formatCurrency} 
                />
                
                <ManifestoSection 
                    storeName={storeName} 
                />
                
                <ContactSection 
                    storeName={storeName} 
                    storeInstagram={storeInstagram} 
                    storeWhatsapp={storeWhatsapp} 
                />
            </div>
        </GuestLayout>
    );
}