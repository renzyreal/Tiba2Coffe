import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import LocationHeader from './Partials/LocationHeader';
import LocationTable from './Partials/LocationTable';
import LocationModal from './Partials/LocationModal';
import DeleteModal from './Partials/DeleteModal';

export default function Index({ locations }) {
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState(null);
    const [deletingLocation, setDeletingLocation] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAdd = () => {
        setEditingLocation(null);
        setShowModal(true);
    };

    const handleEdit = (location) => {
        setEditingLocation(location);
        setShowModal(true);
    };

    const handleDelete = (location) => {
        setDeletingLocation(location);
        setShowDeleteModal(true);
    };

    const handleSubmit = (data) => {
        setLoading(true);
        
        if (editingLocation) {
            router.put(`/store-locations/${editingLocation.id}`, data, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingLocation(null);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            });
        } else {
            router.post('/store-locations', data, {
                onSuccess: () => {
                    setShowModal(false);
                    setLoading(false);
                },
                onError: () => setLoading(false),
            });
        }
    };

    const handleConfirmDelete = () => {
        setLoading(true);
        router.delete(`/store-locations/${deletingLocation.id}`, {
            onSuccess: () => {
                setShowDeleteModal(false);
                setDeletingLocation(null);
                setLoading(false);
            },
            onError: () => setLoading(false),
        });
    };

    const handleUpdateStatus = (location, status) => {
        router.put(`/store-locations/${location.id}/status`, { status }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Manajemen Lokasi" />

            <div className="py-2">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    <LocationHeader onAdd={handleAdd} />

                    <LocationTable 
                        locations={locations}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onUpdateStatus={handleUpdateStatus}
                    />

                    <LocationModal 
                        isOpen={showModal}
                        onClose={() => {
                            setShowModal(false);
                            setEditingLocation(null);
                        }}
                        onSubmit={handleSubmit}
                        location={editingLocation}
                        loading={loading}
                    />

                    <DeleteModal 
                        isOpen={showDeleteModal}
                        onClose={() => {
                            setShowDeleteModal(false);
                            setDeletingLocation(null);
                        }}
                        onConfirm={handleConfirmDelete}
                        location={deletingLocation}
                        loading={loading}
                    />

                </div>
            </div>
        </AuthenticatedLayout>
    );
}