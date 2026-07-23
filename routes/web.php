<?php

use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\CashClosingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\StoreProfileController;
use App\Http\Controllers\StoreLocationController;
use Illuminate\Support\Facades\Route;

// Public Routes
Route::get('/', [LandingPageController::class, 'index'])->name('home');
Route::get('/landing', [LandingPageController::class, 'index'])->name('landing');
Route::get('/menu', [LandingPageController::class, 'menu'])->name('menu');

// Public API
Route::get('/api/store-locations', [StoreLocationController::class, 'getLocations']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/refresh', [DashboardController::class, 'refreshData'])->name('dashboard.refresh');
    Route::get('/api/popular-products', [DashboardController::class, 'getPopularProducts'])->name('api.popular-products');
    
    // POS
    Route::get('/pos', [TransactionController::class, 'pos'])->name('pos');
    Route::post('/transactions', [TransactionController::class, 'store'])->name('transactions.store');
    
    // Categories (Admin only)
    Route::resource('categories', CategoryController::class)->middleware('role:admin');
    Route::get('/api/categories', [CategoryController::class, 'getAll'])->name('api.categories');
    
    // Products
    Route::resource('products', ProductController::class);
    Route::post('/products/{product}/remove-image', [ProductController::class, 'removeImage'])->name('products.remove-image');
    Route::get('/products/best-selling', [ProductController::class, 'getBestSellingProducts'])->name('products.best-selling');
    
    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/transactions/{id}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::get('/transactions/{id}/edit', [TransactionController::class, 'edit'])->name('transactions.edit');
    Route::put('/transactions/{id}/update', [TransactionController::class, 'updateTransaction'])->name('transactions.update');
    Route::get('/transactions/{id}/print', [TransactionController::class, 'print'])->name('transactions.print');
    Route::get('/transactions/{id}/download', [TransactionController::class, 'download'])->name('transactions.download');
    Route::delete('/transactions/{transaction}', [TransactionController::class, 'destroy'])->name('transactions.destroy')->middleware('role:admin');
    
    // Expenses (Admin only)
    Route::resource('expenses', ExpenseController::class)->middleware('role:admin');
    Route::get('/api/expenses/today', [ExpenseController::class, 'todayExpenses'])->name('api.expenses.today')->middleware('role:admin');
    
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::get('/reports/export', [ReportController::class, 'export'])->name('reports.export');
    Route::get('/reports/chart-data', [ReportController::class, 'chartData'])->name('reports.chart-data');
    
    // Cash Closing
    Route::get('/cash-closing/summary', [CashClosingController::class, 'summary'])->name('cash-closing.summary');
    Route::get('/cash-closing/check/{date}', [CashClosingController::class, 'check'])->name('cash-closing.check');
    Route::get('/cash-closing/dashboard-summary', [CashClosingController::class, 'dashboardSummary'])->name('cash-closing.dashboard-summary');
    Route::get('/cash-closing/history', [CashClosingController::class, 'history'])->name('cash-closing.history');
    Route::get('/cash-closing/export/csv', [CashClosingController::class, 'export'])->name('cash-closing.export');
    Route::resource('cash-closing', CashClosingController::class);
    Route::get('/cash-closing/{cashClosing}/print', [CashClosingController::class, 'print'])->name('cash-closing.print');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // User Management (Admin only)
    Route::get('/users', [UserController::class, 'index'])->name('users.index')->middleware('role:admin');
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware('role:admin');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update')->middleware('role:admin');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('role:admin');
    
    // Store Profile
    Route::get('/store-profile', [StoreProfileController::class, 'index'])->name('store-profile.index');
    Route::put('/store-profile/{id}', [StoreProfileController::class, 'update'])->name('store-profile.update');
    
    // Store Locations (Hanya auth, tanpa role admin tambahan karena sudah dicek di controller)
    Route::get('/store-locations', [StoreLocationController::class, 'index'])->name('store-locations.index');
    Route::post('/store-locations', [StoreLocationController::class, 'store'])->name('store-locations.store');
    Route::put('/store-locations/{storeLocation}', [StoreLocationController::class, 'update'])->name('store-locations.update');
    Route::delete('/store-locations/{storeLocation}', [StoreLocationController::class, 'destroy'])->name('store-locations.destroy');
    Route::put('/store-locations/{storeLocation}/status', [StoreLocationController::class, 'updateStatus'])->name('store-locations.status');
    Route::post('/store-locations/reorder', [StoreLocationController::class, 'reorder'])->name('store-locations.reorder');
});

require __DIR__.'/auth.php';