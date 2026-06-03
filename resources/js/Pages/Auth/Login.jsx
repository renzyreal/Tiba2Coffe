import { Head, Link, useForm } from '@inertiajs/react';
import { Coffee, Users, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword, storeProfile }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    
    const [showPassword, setShowPassword] = useState(false);
    
    const storeName = storeProfile?.nama_toko || 'KOPI POS';
    const storeLogo = storeProfile?.logo ? `/storage/${storeProfile.logo}` : null;
    const storeDescription = storeProfile?.deskripsi || 'Solusi POS modern untuk bisnis kopi dan kuliner.';

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title={`Masuk - ${storeName}`} />

            <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="absolute top-20 left-10 text-7xl">☕</div>
                    <div className="absolute top-40 right-20 text-5xl">☕</div>
                    <div className="absolute bottom-40 left-20 text-6xl">☕</div>
                    <div className="absolute bottom-20 right-10 text-8xl">☕</div>
                </div>

                {/* Main Card */}
                <div className="relative z-10 w-full max-w-md">
                    {/* Header dengan informasi cabang */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            {storeLogo ? (
                                <img 
                                    src={storeLogo} 
                                    alt={storeName} 
                                    className="h-20 w-20 object-cover rounded-full border-4 border-red-600 shadow-lg"
                                />
                            ) : (
                                <div className="bg-white border-2 border-red-600 p-4 rounded-full shadow-lg">
                                    <Coffee className="h-12 w-12 text-red-600" />
                                </div>
                            )}
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter text-gray-900">{storeName}</h2>
                        <p className="text-gray-500 text-sm mt-1">{storeDescription}</p>
                    </div>

                    {/* Status message */}
                    {status && (
                        <div className="mb-5 text-sm font-medium text-green-700 bg-green-50 border-l-4 border-green-500 p-3 rounded-r-lg">
                            {status}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={submit} className="bg-white rounded-2xl shadow-xl p-6 space-y-5 border border-gray-100">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-black text-gray-900">MASUK KE AKUN</h3>
                            <p className="text-xs text-gray-500 mt-1">Akses sistem kasir digital</p>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Alamat Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="admin@kopi.com"
                                    autoComplete="username"
                                    autoFocus
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Kata Sandi
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                        errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                    placeholder="Masukkan password"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Memproses...
                                </span>
                            ) : (
                                'MASUK'
                            )}
                        </button>

                        {/* Demo Account Info */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <div className="bg-gray-50 rounded-lg p-3">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    AKUN DEMO
                                </p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-semibold">👑 Admin:</span>
                                        <code className="bg-white px-2 py-1 rounded text-xs font-mono text-gray-800">admin@kopi.com</code>
                                        <code className="bg-white px-2 py-1 rounded text-xs font-mono text-gray-800">password</code>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600 font-semibold">🛒 Kasir:</span>
                                        <code className="bg-white px-2 py-1 rounded text-xs font-mono text-gray-800">kasir@kopi.com</code>
                                        <code className="bg-white px-2 py-1 rounded text-xs font-mono text-gray-800">password</code>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Link ke Landing Page */}
                        <div className="text-center">
                            <Link href="/" className="text-xs text-gray-500 hover:text-red-600 transition">
                                ← Kembali ke Beranda
                            </Link>
                        </div>
                    </form>

                    {/* Footer Info */}
                    <div className="mt-6 text-center text-xs text-gray-400">
                        <p>© {new Date().getFullYear()} {storeName} - Solusi POS untuk UMKM Kopi</p>
                    </div>
                </div>
            </div>
        </>
    );
}