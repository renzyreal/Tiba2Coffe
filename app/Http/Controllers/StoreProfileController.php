<?php

namespace App\Http\Controllers;

use App\Models\StoreProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StoreProfileController extends Controller
{
    /**
     * Display store profile.
     */
    public function index()
    {
        $profile = StoreProfile::first();
        
        // Jika belum ada profile, buat default
        if (!$profile) {
            $profile = StoreProfile::create([
                'nama_toko' => 'Kopi POS',
                'is_active' => true,
            ]);
        }
        
        return Inertia::render('StoreProfile/Index', [
            'profile' => $profile,
        ]);
    }
    
    /**
     * Update store profile.
     */
    public function update(Request $request, $id)
    {
        $profile = StoreProfile::findOrFail($id);
        
        $validated = $request->validate([
            'nama_toko' => 'required|string|max:100',
            'pemilik' => 'nullable|string|max:100',
            'no_telp' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'alamat' => 'nullable|string',
            'kode_pos' => 'nullable|string|max:10',
            'instagram' => 'nullable|string|max:100',
            'facebook' => 'nullable|string|max:100',
            'tiktok' => 'nullable|string|max:100',
            'whatsapp' => 'nullable|string|max:20',
            'deskripsi' => 'nullable|string',
            'waktu_buka' => 'nullable|string|max:50',
            'waktu_tutup' => 'nullable|string|max:50',
        ]);
        
        // Handle logo upload
        if ($request->hasFile('logo')) {
            $request->validate(['logo' => 'image|mimes:jpeg,png,jpg|max:2048']);
            
            if ($profile->logo) {
                Storage::disk('public')->delete($profile->logo);
            }
            
            $validated['logo'] = $request->file('logo')->store('store', 'public');
        }
        
        $profile->update($validated);
        
        return redirect()->back()->with('success', 'Profil toko berhasil diperbarui');
    }
}