import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle, KeyRound } from 'lucide-react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/[0-9]/)) strength++;
        if (password.match(/[^a-zA-Z0-9]/)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(data.password);
    const strengthText = ['Sangat Lemah', 'Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
    const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

    return (
        <section className={className}>
            <form onSubmit={updatePassword} className="space-y-5">
                <div>
                    <InputLabel htmlFor="current_password" value="Password Saat Ini" className="text-gray-700 font-medium text-sm" />
                    <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="current_password"
                            ref={currentPasswordInput}
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            type={showCurrentPassword ? "text" : "password"}
                            className="pl-10 pr-10 block w-full border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 transition-all h-11"
                            autoComplete="current-password"
                            placeholder="Masukkan password saat ini"
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.current_password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password Baru" className="text-gray-700 font-medium text-sm" />
                    <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Shield className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10 block w-full border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 transition-all h-11"
                            autoComplete="new-password"
                            placeholder="Masukkan password baru"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    
                    {data.password && (
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${strengthColor[passwordStrength]} transition-all duration-300`}
                                        style={{ width: `${(passwordStrength + 1) * 20}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-gray-600">
                                    {strengthText[passwordStrength]}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                                <div className={`flex items-center gap-1.5 ${data.password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${data.password.length >= 8 ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Minimal 8 karakter
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordStrength >= 1 ? 'text-green-600' : 'text-gray-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength >= 1 ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Huruf besar & kecil
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordStrength >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength >= 2 ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Angka 0-9
                                </div>
                                <div className={`flex items-center gap-1.5 ${passwordStrength >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${passwordStrength >= 3 ? 'bg-green-600' : 'bg-gray-300'}`} />
                                    Simbol !@#$ 
                                </div>
                            </div>
                        </div>
                    )}
                    
                    <InputError message={errors.password} className="mt-1.5" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="text-gray-700 font-medium text-sm" />
                    <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyRound className="h-5 w-5 text-gray-400" />
                        </div>
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            type={showPasswordConfirmation ? "text" : "password"}
                            className="pl-10 pr-10 block w-full border-gray-200 rounded-xl focus:border-red-500 focus:ring-red-500 transition-all h-11"
                            autoComplete="new-password"
                            placeholder="Konfirmasi password baru"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPasswordConfirmation ? (
                                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation} className="mt-1.5" />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                            <CheckCircle className="w-4 h-4" />
                            Password berhasil diperbarui
                        </div>
                    </Transition>

                    <button 
                        type="submit"
                        disabled={processing}
                        className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <KeyRound className="w-4 h-4" />
                        {processing ? 'Memperbarui...' : 'Perbarui Password'}
                    </button>
                </div>
            </form>
        </section>
    );
}