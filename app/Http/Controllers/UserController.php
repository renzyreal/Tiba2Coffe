<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $users = User::when($request->search, function ($query, $search) {
                return $query->where('name', 'LIKE', "%{$search}%")
                             ->orWhere('email', 'LIKE', "%{$search}%");
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();
        
        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        // Debug log
        \Log::info('Store user request:', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:admin,cashier',
        ], [
            'name.required' => 'Nama lengkap wajib diisi',
            'name.max' => 'Nama lengkap maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'password.required' => 'Password wajib diisi',
            'password.min' => 'Password minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password tidak cocok',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
        ]);
        
        // Tambahan validasi password strength
        $password = $request->password;
        $passwordErrors = [];
        
        if (strlen($password) < 8) {
            $passwordErrors[] = 'Password minimal 8 karakter';
        }
        if (!preg_match('/[A-Z]/', $password)) {
            $passwordErrors[] = 'Password harus mengandung huruf besar';
        }
        if (!preg_match('/[a-z]/', $password)) {
            $passwordErrors[] = 'Password harus mengandung huruf kecil';
        }
        if (!preg_match('/[0-9]/', $password)) {
            $passwordErrors[] = 'Password harus mengandung angka';
        }
        
        if (!empty($passwordErrors)) {
            return redirect()->back()->withErrors(['password' => implode(', ', $passwordErrors)])->withInput();
        }
        
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $request->role,
            ]);
            
            \Log::info('User created successfully:', $user->toArray());
            
            return redirect()->back()->with('success', 'Pengguna berhasil ditambahkan');
        } catch (\Exception $e) {
            \Log::error('Error creating user: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menambahkan pengguna: ' . $e->getMessage())->withInput();
        }
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        \Log::info('Update user request:', $request->all());
        
        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'role' => 'required|in:admin,cashier',
        ];
        
        $messages = [
            'name.required' => 'Nama lengkap wajib diisi',
            'name.max' => 'Nama lengkap maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah digunakan',
            'role.required' => 'Role wajib dipilih',
            'role.in' => 'Role tidak valid',
        ];
        
        if ($request->filled('password')) {
            $rules['password'] = 'required|min:8|confirmed';
            $messages['password.required'] = 'Password wajib diisi';
            $messages['password.min'] = 'Password minimal 8 karakter';
            $messages['password.confirmed'] = 'Konfirmasi password tidak cocok';
            
            // Validasi password strength
            $password = $request->password;
            $passwordErrors = [];
            
            if (strlen($password) < 8) {
                $passwordErrors[] = 'Password minimal 8 karakter';
            }
            if (!preg_match('/[A-Z]/', $password)) {
                $passwordErrors[] = 'Password harus mengandung huruf besar';
            }
            if (!preg_match('/[a-z]/', $password)) {
                $passwordErrors[] = 'Password harus mengandung huruf kecil';
            }
            if (!preg_match('/[0-9]/', $password)) {
                $passwordErrors[] = 'Password harus mengandung angka';
            }
            
            if (!empty($passwordErrors)) {
                return redirect()->back()->withErrors(['password' => implode(', ', $passwordErrors)])->withInput();
            }
        }
        
        $request->validate($rules, $messages);
        
        try {
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'role' => $request->role,
            ]);
            
            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($request->password)]);
            }
            
            \Log::info('User updated successfully:', $user->toArray());
            
            return redirect()->back()->with('success', 'Pengguna berhasil diperbarui');
        } catch (\Exception $e) {
            \Log::error('Error updating user: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal memperbarui pengguna: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus akun sendiri');
        }
        
        try {
            $user->delete();
            return redirect()->back()->with('success', 'Pengguna berhasil dihapus');
        } catch (\Exception $e) {
            \Log::error('Error deleting user: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Gagal menghapus pengguna: ' . $e->getMessage());
        }
    }
}