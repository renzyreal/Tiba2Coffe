import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Search, UserPlus, RefreshCw } from 'lucide-react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import UserTable from './Partials/UserTable';
import UserModal from './Partials/UserModal';
import DeleteModal from './Partials/DeleteModal';

export default function Index({ users, filters }) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [deletingUser, setDeletingUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const [flashMessage, setFlashMessage] = useState(null);

    // Listen untuk flash messages dari server
    React.useEffect(() => {
        const flash = window.flash || null;
        if (flash) {
            setFlashMessage(flash);
            setTimeout(() => setFlashMessage(null), 5000);
        }
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/users', { search }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        router.get('/users', { search: '' }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleAdd = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const handleDelete = (user) => {
        setDeletingUser(user);
        setShowDeleteModal(true);
    };

    const handleSubmit = (data) => {
        setLoading(true);
        
        console.log('Submitting data:', data);
        
        if (editingUser) {
            router.put(`/users/${editingUser.id}`, data, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingUser(null);
                    setLoading(false);
                },
                onError: (errors) => {
                    console.error('Update error:', errors);
                    setLoading(false);
                },
            });
        } else {
            router.post('/users', data, {
                onSuccess: () => {
                    setShowModal(false);
                    setLoading(false);
                },
                onError: (errors) => {
                    console.error('Store error:', errors);
                    setLoading(false);
                },
            });
        }
    };

    const handleConfirmDelete = () => {
        setLoading(true);
        router.delete(`/users/${deletingUser.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeletingUser(null);
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Pengguna" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Flash Messages */}
                    {flashMessage && (
                        <div className={`mb-4 p-4 rounded-lg ${
                            flashMessage.type === 'success' 
                                ? 'bg-green-50 border-l-4 border-green-400 text-green-700'
                                : 'bg-red-50 border-l-4 border-red-400 text-red-700'
                        }`}>
                            {flashMessage.message}
                        </div>
                    )}

                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-black dark:text-white">
                                    Manajemen Pengguna
                                </h1>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Kelola akun admin dan kasir yang memiliki akses ke sistem
                                </p>
                            </div>
                            
                            <div className="mt-4 sm:mt-0">
                                <button
                                    onClick={handleAdd}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Tambah Pengguna
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* User Table */}
                    <UserTable 
                        users={users}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />

                    {/* Modal Tambah/Edit */}
                    <UserModal 
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setEditingUser(null);
                        }}
                        onSubmit={handleSubmit}
                        user={editingUser}
                        loading={loading}
                    />

                    {/* Modal Hapus */}
                    <DeleteModal 
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setDeletingUser(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        user={deletingUser}
                        loading={loading}
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}