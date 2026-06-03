import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    ShoppingCart, 
    Package, 
    Tag, 
    History, 
    TrendingUp, 
    Wallet,
    Receipt,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    Sun,
    Moon,
    Coffee,
    Clock,
    Info,
    Cpu,
    Database,
    Globe,
    Code,
    ChevronDown,
    ChevronUp,
    UserCircle,
    ChevronLeft,
    ChevronRight,
    Store
} from 'lucide-react';

export default function AuthenticatedLayout({ children }) {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isSpecsOpen, setIsSpecsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    const user = props.auth?.user || props.user || null;
    const storeProfile = props.storeProfile || null;
    const isAdmin = user?.role === 'admin';
    const isCashier = user?.role === 'cashier';

    // Load sidebar collapsed state from localStorage
    useEffect(() => {
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        if (savedCollapsed !== null) {
            setSidebarCollapsed(savedCollapsed === 'true');
        }
    }, []);

    // Save sidebar collapsed state
    const toggleSidebarCollapse = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem('sidebarCollapsed', newState);
    };

    const getNavigation = () => {
        const commonNav = [
            { name: 'Dashboard', href: route('dashboard'), icon: LayoutDashboard, roles: ['admin', 'cashier'] },
            { name: 'Penjualan', href: route('pos'), icon: ShoppingCart, roles: ['admin', 'cashier'] },
            { name: 'Transaksi', href: route('transactions.index'), icon: History, roles: ['admin', 'cashier'] },
        ];

        const adminNav = [
            { name: 'Produk', href: route('products.index'), icon: Package, roles: ['admin'] },
            { name: 'Kategori', href: route('categories.index'), icon: Tag, roles: ['admin'] },
            { name: 'Pengeluaran', href: route('expenses.index'), icon: Wallet, roles: ['admin'] },
            { name: 'Tutup Kas', href: route('cash-closing.index'), icon: Receipt, roles: ['admin'] },
            { name: 'Laporan', href: route('reports.index'), icon: TrendingUp, roles: ['admin'] },
            { name: 'Pengguna', href: route('users.index'), icon: Users, roles: ['admin'] },
            { name: 'Profil Toko', href: route('store-profile.index'), icon: Store, roles: ['admin'] },
        ];

        let navigation = [...commonNav];
        
        if (isAdmin) {
            navigation = [...navigation, ...adminNav];
        }
        
        return navigation;
    };

    const navigation = getNavigation();

    const isActive = (href) => {
        const currentPath = url.split('?')[0];
        
        if (href === route('dashboard')) {
            return currentPath === '/dashboard' || currentPath.startsWith('/dashboard/');
        }
        if (href === route('pos')) {
            return currentPath === '/pos' || currentPath.startsWith('/pos/');
        }
        if (href === route('products.index')) {
            return currentPath === '/products' || currentPath.startsWith('/products/');
        }
        if (href === route('categories.index')) {
            return currentPath === '/categories' || currentPath.startsWith('/categories/');
        }
        if (href === route('transactions.index')) {
            return currentPath === '/transactions' || currentPath.startsWith('/transactions/');
        }
        if (href === route('expenses.index')) {
            return currentPath === '/expenses' || currentPath.startsWith('/expenses/');
        }
        if (href === route('cash-closing.index')) {
            return currentPath === '/cash-closing' || currentPath.startsWith('/cash-closing/');
        }
        if (href === route('reports.index')) {
            return currentPath === '/reports' || currentPath.startsWith('/reports/');
        }
        if (href === route('users.index')) {
            return currentPath === '/users' || currentPath.startsWith('/users/');
        }
        if (href === route('store-profile.index')) {
            return currentPath === '/store-profile' || currentPath.startsWith('/store-profile/');
        }
        if (href === '/profile') {
            return currentPath === '/profile';
        }
        
        return currentPath === href || (href !== '/' && currentPath.startsWith(href + '/'));
    };

    useEffect(() => {
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode === 'true') {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const toggleDarkMode = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem('darkMode', newMode);
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('id-ID', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
    };

    const projectSpecs = {
        version: '1.0.0',
        framework: 'Laravel + React (Inertia)',
        database: 'MySQL / PostgreSQL',
        php: '8.2+',
        node: '20.x',
        status: 'Production Ready',
        lastUpdate: 'Desember 2024',
        developer: 'Kopi POS Team',
        license: 'Commercial'
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    // Nama toko dari store_profile atau default
    const storeName = storeProfile?.nama_toko || 'Kopi POS';
    // Buat URL logo lengkap dengan asset()
    const storeLogoUrl = storeProfile?.logo ? `/storage/${storeProfile.logo}` : null;

    return (
        <div className={darkMode ? 'dark' : ''}>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div className={`fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-xl transform transition-all duration-300 ease-in-out flex flex-col ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                } ${sidebarCollapsed ? 'w-20' : 'w-72'}`}>
                    {/* Logo */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
                            {storeLogoUrl ? (
                                <img 
                                    src={storeLogoUrl} 
                                    alt={storeName} 
                                    className="h-10 w-10 object-cover rounded-lg flex-shrink-0"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className={`bg-amber-100 dark:bg-amber-900/30 p-2 rounded-xl flex-shrink-0 ${storeLogoUrl ? 'hidden' : 'flex'}`}>
                                <Coffee className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                            </div>
                            {!sidebarCollapsed && (
                                <div>
                                    <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-red-600 bg-clip-text text-transparent">
                                        {storeName}
                                    </span>
                                </div>
                            )}
                        </div>
                        {!sidebarCollapsed && (
                            <button 
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        )}
                    </div>

                    {/* Collapse Toggle Button */}
                    <button
                        onClick={toggleSidebarCollapse}
                        className="hidden lg:flex absolute -right-3 top-20 bg-white dark:bg-gray-700 rounded-full p-1 shadow-md border border-gray-200 dark:border-gray-600 z-10"
                    >
                        {sidebarCollapsed ? (
                            <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <ChevronLeft className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                        )}
                    </button>

                    {/* Navigation Menu */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {navigation.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                                        active
                                            ? 'bg-gradient-to-r from-red-500 to-amber-500 text-white shadow-md'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    } ${sidebarCollapsed ? 'justify-center' : ''}`}
                                    title={sidebarCollapsed ? item.name : ''}
                                >
                                    <item.icon className={`h-5 w-5 transition-colors ${
                                        active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                                    } ${sidebarCollapsed ? 'mr-0' : 'mr-3'}`} />
                                    {!sidebarCollapsed && (
                                        <>
                                            {item.name}
                                            {active && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white"></div>
                                            )}
                                        </>
                                    )}
                                    {sidebarCollapsed && active && (
                                        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-red-500 to-amber-500 rounded-r-full"></div>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="border-t border-gray-200 dark:border-gray-700">
                        {/* Spesifikasi Proyek */}
                        <div className="p-4">
                            <button
                                onClick={() => setIsSpecsOpen(!isSpecsOpen)}
                                className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-2 py-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors`}
                                title={sidebarCollapsed ? 'Spesifikasi' : ''}
                            >
                                <div className="flex items-center gap-2">
                                    <Info className="h-3.5 w-3.5" />
                                    {!sidebarCollapsed && <span>Spesifikasi Proyek</span>}
                                </div>
                                {!sidebarCollapsed && (
                                    isSpecsOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />
                                )}
                            </button>

                            {!sidebarCollapsed && isSpecsOpen && (
                                <div className="mt-2 space-y-2 text-xs">
                                    <div className="grid grid-cols-2 gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                            <Code className="h-3 w-3" />
                                            <span>Versi:</span>
                                        </div>
                                        <div className="text-gray-800 dark:text-gray-200 font-mono">
                                            {projectSpecs.version}
                                        </div>

                                        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                                            <Cpu className="h-3 w-3" />
                                            <span>Framework:</span>
                                        </div>
                                        <div className="text-gray-800 dark:text-gray-200 font-mono text-xs">
                                            {projectSpecs.framework}
                                        </div>

                                        <div className="col-span-2 mt-1 pt-1 border-t border-gray-200 dark:border-gray-600">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 dark:text-gray-400">Status:</span>
                                                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                                                    {projectSpecs.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status Online */}
                        {!sidebarCollapsed && (
                            <div className="px-4 pb-4">
                                <div className="flex items-center justify-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Server Online</span>
                                    </div>
                                    <div className="w-px h-3 bg-gray-300 dark:bg-gray-600"></div>
                                    <div className="flex items-center gap-1.5">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                        <span className="text-[10px] text-gray-400 dark:text-gray-500">Realtime</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main content */}
                <div className={`transition-all duration-300 ${sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'}`}>
                    {/* TOP NAVBAR */}
                    <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between px-4 py-3">
                            {/* Left side */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <Menu className="h-5 w-5" />
                                </button>
                                <div className="hidden lg:block">
                                    <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                                        Selamat datang kembali, {user?.name?.split(' ')[0]}!
                                    </h1>
                                </div>
                            </div>

                            {/* Right side */}
                            <div className="flex items-center space-x-3">
                                <div className="hidden md:flex items-center space-x-3 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl">
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(currentTime)}
                                        </p>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {formatTime(currentTime)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                                </button>

                                <div className="relative">
                                    <button
                                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="text-right hidden sm:block">
                                            <p className="text-sm font-semibold text-black dark:text-white">
                                                {user?.name || 'User'}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {user?.role === 'admin' ? 'Administrator' : (user?.role === 'cashier' ? 'Kasir' : 'Staff')}
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center shadow-md">
                                                <span className="text-white text-sm font-medium">
                                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"></div>
                                        </div>
                                        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {isUserMenuOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-black/10 dark:border-white/10 py-2 z-10">
                                            <div className="px-4 py-3 border-b border-black/10 dark:border-white/10">
                                                <p className="text-sm font-semibold text-black dark:text-white">
                                                    {user?.name || 'User'}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {user?.email || 'user@example.com'}
                                                </p>
                                            </div>
                                            <Link 
                                                href="/profile" 
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-black dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                                            >
                                                <UserCircle className="h-4 w-4" />
                                                <span>Profil Saya</span>
                                            </Link>
                                            <div className="border-t border-black/10 dark:border-white/10 my-1"></div>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Keluar</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Page Content */}
                    <main className="p-4 md:p-6">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}