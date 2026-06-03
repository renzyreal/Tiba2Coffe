import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { AlertTriangle, Lock, X } from 'lucide-react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`${className}`}>
            <div className="flex items-center justify-between p-4 bg-red-50/50 rounded-xl border border-red-100">
                <div>
                    <h3 className="font-semibold text-red-900">Hapus Akun</h3>
                    <p className="text-sm text-red-700 mt-0.5">
                        Setelah dihapus, semua data akan hilang secara permanen.
                    </p>
                </div>
                <button
                    onClick={confirmUserDeletion}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] flex items-center gap-2"
                >
                    <AlertTriangle className="w-4 h-4" />
                    Hapus Akun
                </button>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-red-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-gray-900">
                                Hapus Akun
                            </h2>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    <div className="mt-2">
                        <p className="text-sm text-gray-600">
                            Tindakan ini tidak dapat dibatalkan. Semua data Anda termasuk transaksi,
                            produk, dan pengaturan akan dihapus secara permanen.
                        </p>
                        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-sm text-amber-800 font-medium">
                                ⚠️ Peringatan: Ini akan menghapus secara permanen:
                            </p>
                            <ul className="text-xs text-amber-700 mt-2 space-y-1 list-disc list-inside">
                                <li>Informasi profil Anda</li>
                                <li>Semua catatan transaksi</li>
                                <li>Akses ke sistem</li>
                            </ul>
                        </div>
                    </div>

                    <form onSubmit={deleteUser} className="mt-6">
                        <div>
                            <InputLabel 
                                htmlFor="password" 
                                value="Masukkan password Anda untuk konfirmasi" 
                                className="text-gray-700 font-medium"
                            />
                            <div className="relative mt-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    ref={passwordInput}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="pl-10 block w-full border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500"
                                    placeholder="Masukkan password Anda"
                                    isFocused
                                />
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                {processing ? 'Menghapus...' : 'Hapus Akun'}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </section>
    );
}