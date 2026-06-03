<?php

namespace App\Http\Controllers;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Check if user is authenticated
     */
    protected function authorizeProfile(): void
    {
        if (!auth()->check()) {
            abort(403, 'Anda harus login untuk mengakses halaman ini.');
        }
    }

    /**
     * Validate profile update request
     */
    protected function validateProfileUpdate(Request $request): array
    {
        $userId = auth()->id();

        $rules = [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId)
            ],
            'current_password' => 'nullable|required_with:password|current_password',
            'password' => 'nullable|min:8|confirmed|different:current_password',
        ];

        $messages = [
            'name.required' => 'Nama wajib diisi',
            'name.string' => 'Nama harus berupa teks',
            'name.max' => 'Nama maksimal 255 karakter',
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 255 karakter',
            'email.unique' => 'Email sudah digunakan oleh pengguna lain',
            'current_password.required_with' => 'Password saat ini wajib diisi untuk mengubah password',
            'current_password.current_password' => 'Password saat ini salah',
            'password.min' => 'Password baru minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok',
            'password.different' => 'Password baru harus berbeda dengan password saat ini',
        ];

        return $request->validate($rules, $messages);
    }

    /**
     * Get profile data for update
     */
    protected function getProfileData(Request $request): array
    {
        $data = [
            'name' => $request->name,
            'email' => $request->email,
        ];
        
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->password);
        }
        
        return $data;
    }

    /**
     * Validate account deletion request
     */
    protected function validateAccountDeletion(Request $request): array
    {
        return $request->validate([
            'password' => ['required', 'current_password'],
        ], [
            'password.required' => 'Password wajib diisi untuk menghapus akun',
            'password.current_password' => 'Password yang dimasukkan salah',
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        // Authorize
        $this->authorizeProfile();

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        // Validate request
        $this->validateProfileUpdate($request);
        
        $user = $request->user();
        
        // Get validated data
        $data = $this->getProfileData($request);
        
        // Fill user data
        $user->fill($data);

        // Reset email verification if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Profil berhasil diperbarui');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        // Validate request
        $this->validateAccountDeletion($request);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Update user password only
     */
    public function updatePassword(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        // Validate password only
        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'min:8', 'confirmed', 'different:current_password'],
        ], [
            'current_password.required' => 'Password saat ini wajib diisi',
            'current_password.current_password' => 'Password saat ini salah',
            'password.required' => 'Password baru wajib diisi',
            'password.min' => 'Password baru minimal 8 karakter',
            'password.confirmed' => 'Konfirmasi password baru tidak cocok',
            'password.different' => 'Password baru harus berbeda dengan password saat ini',
        ]);

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Password berhasil diperbarui');
    }

    /**
     * Update user email only
     */
    public function updateEmail(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        $userId = auth()->id();

        // Validate email only
        $request->validate([
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($userId)
            ],
        ], [
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.max' => 'Email maksimal 255 karakter',
            'email.unique' => 'Email sudah digunakan oleh pengguna lain',
        ]);

        $user = $request->user();
        $user->email = $request->email;
        $user->email_verified_at = null;
        $user->save();

        return Redirect::route('profile.edit')->with('success', 'Email berhasil diperbarui, silakan verifikasi email baru Anda');
    }

    /**
     * Update user profile photo (if applicable)
     */
    public function updatePhoto(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'photo.required' => 'Foto profil wajib diunggah',
            'photo.image' => 'File harus berupa gambar',
            'photo.mimes' => 'Format gambar harus JPEG, PNG, atau JPG',
            'photo.max' => 'Ukuran gambar maksimal 2MB',
        ]);

        $user = $request->user();
        
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($user->photo && file_exists(storage_path('app/public/' . $user->photo))) {
                unlink(storage_path('app/public/' . $user->photo));
            }
            
            $path = $request->file('photo')->store('profile-photos', 'public');
            $user->photo = $path;
            $user->save();
        }

        return Redirect::route('profile.edit')->with('success', 'Foto profil berhasil diperbarui');
    }

    /**
     * Remove user profile photo
     */
    public function removePhoto(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        $user = $request->user();
        
        if ($user->photo && file_exists(storage_path('app/public/' . $user->photo))) {
            unlink(storage_path('app/public/' . $user->photo));
            $user->photo = null;
            $user->save();
        }

        return Redirect::route('profile.edit')->with('success', 'Foto profil berhasil dihapus');
    }

    /**
     * Resend email verification notification
     */
    public function resendVerification(Request $request): RedirectResponse
    {
        // Authorize
        $this->authorizeProfile();

        $user = $request->user();

        if ($user->hasVerifiedEmail()) {
            return Redirect::route('profile.edit')->with('info', 'Email Anda sudah diverifikasi');
        }

        $user->sendEmailVerificationNotification();

        return Redirect::route('profile.edit')->with('success', 'Link verifikasi baru telah dikirim ke email Anda');
    }
}