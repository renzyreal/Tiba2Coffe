import React from 'react';
import { Link } from '@inertiajs/react';
import { Edit, Trash2, MapPin, Star, Circle } from 'lucide-react';

export default function LocationTable({ locations, onEdit, onDelete }) {
    const getStatusBadge = (status) => {
        const badges = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-700',
            holiday: 'bg-red-100 text-red-700',
        };
        return badges[status] || 'bg-gray-100 text-gray-700';
    };

    const getStatusText = (status) => {
        const texts = {
            active: 'Buka',
            inactive: 'Tutup',
            holiday: 'Libur',
        };
        return texts[status] || status;
    };

    const formatJam = (jam) => {
        if (!jam) return '-';
        return jam.substring(0, 5);
    };

    if (locations.data?.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-gray-500">Belum ada lokasi</p>
                <p className="text-xs text-gray-400 mt-1">
                    Klik tombol "Tambah Lokasi" untuk menambahkan lokasi baru
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alamat</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jam</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hari</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utama</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {locations.data.map((location, index) => (
                            <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {(locations.current_page - 1) * locations.per_page + index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 text-red-500 mr-2" />
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {location.nama_lokasi}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                                    {location.alamat}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                    {formatJam(location.jam_buka)} - {formatJam(location.jam_tutup)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                                    {location.hari || '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusBadge(location.status)}`}>
                                        {getStatusText(location.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    {location.is_main ? (
                                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                    ) : (
                                        <Circle className="h-4 w-4 text-gray-300" />
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                    <button
                                        onClick={() => onEdit(location)}
                                        className="text-blue-600 hover:text-blue-800 mr-3 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(location)}
                                        className="text-red-600 hover:text-red-800 transition-colors"
                                        title="Hapus"
                                        disabled={location.is_main}
                                    >
                                        <Trash2 className={`h-4 w-4 ${location.is_main ? 'opacity-50 cursor-not-allowed' : ''}`} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {locations.last_page > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Menampilkan {locations.from} - {locations.to} dari {locations.total} data
                        </div>
                        <div className="flex gap-1">
                            {locations.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                        link.active
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                    } ${!link.url ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}