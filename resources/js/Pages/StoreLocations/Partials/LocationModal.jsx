import React, { useState, useEffect } from 'react';
import { X, MapPin } from 'lucide-react';

export default function LocationModal({ isOpen, onClose, onSubmit, location, loading }) {
    const [formData, setFormData] = useState({
        nama_lokasi: '',
        alamat: '',
        hari: '',
        jam_buka: '',
        jam_tutup: '',
        status: 'active',
        is_main: false,
        deskripsi: '',
        map_url: '',
        urutan: 0,
    });

    useEffect(() => {
        if (location) {
            setFormData({
                nama_lokasi: location.nama_lokasi || '',
                alamat: location.alamat || '',
                hari: location.hari || '',
                jam_buka: location.jam_buka ? location.jam_buka.substring(0, 5) : '',
                jam_tutup: location.jam_tutup ? location.jam_tutup.substring(0, 5) : '',
                status: location.status || 'active',
                is_main: location.is_main || false,
                deskripsi: location.deskripsi || '',
                map_url: location.map_url || '',
                urutan: location.urutan || 0,
            });
        } else {
            setFormData({
                nama_lokasi: '',
                alamat: '',
                hari: '',
                jam_buka: '',
                jam_tutup: '',
                status: 'active',
                is_main: false,
                deskripsi: '',
                map_url: '',
                urutan: 0,
            });
        }
    }, [location, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-4xl mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-red-600" />
                        <h3 className="text-lg font-semibold text-black dark:text-white">
                            {location ? 'Edit Lokasi' : 'Tambah Lokasi'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form - Grid 2 Kolom */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Kolom Kiri */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Nama Lokasi <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nama_lokasi"
                                    value={formData.nama_lokasi}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="Contoh: Main Pop-Up"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Alamat <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="Jl. Sudirman No. 123"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Hari
                                </label>
                                <input
                                    type="text"
                                    name="hari"
                                    value={formData.hari}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="Senin - Jumat"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Jam Buka
                                    </label>
                                    <input
                                        type="time"
                                        name="jam_buka"
                                        value={formData.jam_buka}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Jam Tutup
                                    </label>
                                    <input
                                        type="time"
                                        name="jam_tutup"
                                        value={formData.jam_tutup}
                                        onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                >
                                    <option value="active">Buka</option>
                                    <option value="inactive">Tutup</option>
                                    {/* <option value="holiday">Libur</option> */}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Urutan
                                </label>
                                <input
                                    type="number"
                                    name="urutan"
                                    value={formData.urutan}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="1"
                                />
                            </div>

                            {/* Toggle Switch untuk Lokasi Utama */}
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Lokasi Utama
                                </label>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, is_main: !formData.is_main })}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                                            formData.is_main ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                                                formData.is_main ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                    <span className={`text-sm font-medium ${formData.is_main ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {formData.is_main ? '✓ Lokasi Utama' : 'Bukan Lokasi Utama'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mt-5 mb-1">
                                    Link Google Maps
                                </label>
                                <input
                                    type="url"
                                    name="map_url"
                                    value={formData.map_url}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="https://maps.google.com/..."
                                />
                            </div>
                        </div>

                        {/* Deskripsi - Full Width */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Deskripsi
                            </label>
                            <textarea
                                name="deskripsi"
                                value={formData.deskripsi}
                                onChange={handleChange}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white resize-none"
                                placeholder="Deskripsi lokasi..."
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Memproses...' : (location ? 'Simpan Perubahan' : 'Tambah Lokasi')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}