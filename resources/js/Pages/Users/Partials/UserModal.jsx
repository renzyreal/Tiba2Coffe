import React, { useState, useEffect } from 'react';
import { X, Shield, User, Eye, EyeOff } from 'lucide-react';

export default function UserModal({ isOpen, onClose, onSubmit, user, loading }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'cashier',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                password_confirmation: '',
                role: user.role || 'cashier',
            });
        } else {
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: '',
                role: 'cashier',
            });
        }
        setErrors({});
    }, [user, isOpen]);

    // Validasi password realtime
    const validatePassword = (password) => {
        const newErrors = {};
        
        if (!user && !password) {
            newErrors.password = 'Password wajib diisi';
        } else if (password && password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        } else if (password && !/[A-Z]/.test(password)) {
            newErrors.password = 'Password harus mengandung huruf besar';
        } else if (password && !/[a-z]/.test(password)) {
            newErrors.password = 'Password harus mengandung huruf kecil';
        } else if (password && !/[0-9]/.test(password)) {
            newErrors.password = 'Password harus mengandung angka';
        } else {
            newErrors.password = null;
        }
        
        return newErrors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
        
        // Real-time password validation
        if (name === 'password') {
            const passwordErrors = validatePassword(value);
            if (passwordErrors.password) {
                setErrors(prev => ({ ...prev, password: passwordErrors.password }));
            } else {
                setErrors(prev => ({ ...prev, password: undefined }));
            }
        }
        
        // Check password confirmation
        if (name === 'password_confirmation' || (name === 'password' && formData.password_confirmation)) {
            const confirmValue = name === 'password_confirmation' ? value : formData.password_confirmation;
            const passValue = name === 'password' ? value : formData.password;
            
            if (confirmValue && passValue !== confirmValue) {
                setErrors(prev => ({ ...prev, password_confirmation: 'Konfirmasi password tidak cocok' }));
            } else {
                setErrors(prev => ({ ...prev, password_confirmation: undefined }));
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Final validation
        const newErrors = {};
        
        if (!formData.name) newErrors.name = 'Nama lengkap wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        if (!user && !formData.password) newErrors.password = 'Password wajib diisi';
        
        if (formData.password && formData.password.length < 8) {
            newErrors.password = 'Password minimal 8 karakter';
        } else if (formData.password && !/[A-Z]/.test(formData.password)) {
            newErrors.password = 'Password harus mengandung huruf besar';
        } else if (formData.password && !/[a-z]/.test(formData.password)) {
            newErrors.password = 'Password harus mengandung huruf kecil';
        } else if (formData.password && !/[0-9]/.test(formData.password)) {
            newErrors.password = 'Password harus mengandung angka';
        }
        
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Konfirmasi password tidak cocok';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSubmit(formData);
    };

    if (!isOpen) return null;

    // Password strength indicator
    const getPasswordStrength = () => {
        const password = formData.password;
        if (!password) return { strength: 0, text: '', color: '' };
        
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        
        if (score === 4) return { strength: 4, text: 'Kuat', color: 'text-green-600' };
        if (score === 3) return { strength: 3, text: 'Sedang', color: 'text-yellow-600' };
        return { strength: 2, text: 'Lemah', color: 'text-red-600' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                    <h3 className="text-lg font-semibold text-black dark:text-white">
                        {user ? 'Edit Pengguna' : 'Tambah Pengguna'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Masukkan nama lengkap"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                                errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                            }`}
                            placeholder="Masukkan email"
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Password {!user && <span className="text-red-500">*</span>}
                            {user && <span className="text-xs text-gray-500"> (Kosongkan jika tidak diubah)</span>}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 ${
                                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Masukkan password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        
                        {/* Password requirements hint */}
                        {formData.password && (
                            <div className="mt-2 space-y-1">
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={`h-1.5 w-1.5 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                                        Minimal 8 karakter
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                                        Huruf besar (A-Z)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={/[a-z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                                        Huruf kecil (a-z)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs">
                                    <div className={`h-1.5 w-1.5 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    <span className={/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}>
                                        Angka (0-9)
                                    </span>
                                </div>
                                <div className="mt-1 text-xs">
                                    <span className="font-medium">Kekuatan Password: </span>
                                    <span className={passwordStrength.color}>{passwordStrength.text}</span>
                                </div>
                            </div>
                        )}
                        
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Konfirmasi Password {!user && <span className="text-red-500">*</span>}
                        </label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                className={`w-full px-3 py-2 text-sm border rounded-lg bg-white dark:bg-gray-800 text-black dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent pr-10 ${
                                    errors.password_confirmation ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                }`}
                                placeholder="Konfirmasi password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.password_confirmation && (
                            <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Role <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                                formData.role === 'admin'
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="admin"
                                    checked={formData.role === 'admin'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <Shield className="h-4 w-4 text-red-600" />
                                <span className="text-sm font-medium">Administrator</span>
                            </label>
                            <label className={`flex items-center justify-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                                formData.role === 'cashier'
                                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                    : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}>
                                <input
                                    type="radio"
                                    name="role"
                                    value="cashier"
                                    checked={formData.role === 'cashier'}
                                    onChange={handleChange}
                                    className="sr-only"
                                />
                                <User className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium">Kasir</span>
                            </label>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 pt-4">
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
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Memproses...' : (user ? 'Simpan Perubahan' : 'Tambah Pengguna')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}