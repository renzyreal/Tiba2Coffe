<?php

namespace App\Http\Controllers;

use App\Models\StoreLocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class StoreLocationController extends Controller
{
    protected function isAdmin(): bool
    {
        return auth()->user() && auth()->user()->isAdmin();
    }

    protected function authorizeAdmin(): void
    {
        if (!$this->isAdmin()) {
            abort(403, 'Unauthorized action. Only admin can access this resource.');
        }
    }

    /**
     * Get all locations for landing page (public)
     */
    public function getLocations()
    {
        $locations = StoreLocation::active()
            ->orderBy('urutan')
            ->orderBy('is_main', 'desc')
            ->get();

        return response()->json($locations);
    }

    /**
     * Display a listing of locations (admin)
     */
    public function index(Request $request)
    {
        $this->authorizeAdmin();

        $locations = StoreLocation::orderBy('urutan')
            ->orderBy('is_main', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('StoreLocations/Index', [
            'locations' => $locations,
        ]);
    }

    /**
     * Store a newly created location.
     */
    public function store(Request $request)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'nama_lokasi' => 'required|string|max:100',
            'alamat' => 'required|string|max:255',
            'hari' => 'nullable|string|max:50',
            'jam_buka' => 'nullable|date_format:H:i',
            'jam_tutup' => 'nullable|date_format:H:i|after:jam_buka',
            'status' => ['required', Rule::in(['active', 'inactive', 'holiday'])],
            'is_main' => 'boolean',
            'deskripsi' => 'nullable|string',
            'map_url' => 'nullable|url|max:255',
            'urutan' => 'nullable|integer',
        ]);

        // Jika is_main true, set semua lokasi lain menjadi false
        if ($validated['is_main']) {
            StoreLocation::where('is_main', true)->update(['is_main' => false]);
        }

        $validated['urutan'] = $validated['urutan'] ?? StoreLocation::count() + 1;

        StoreLocation::create($validated);

        return redirect()->back()->with('success', 'Lokasi berhasil ditambahkan');
    }

    /**
     * Update the specified location.
     */
    public function update(Request $request, StoreLocation $storeLocation)
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'nama_lokasi' => 'required|string|max:100',
            'alamat' => 'required|string|max:255',
            'hari' => 'nullable|string|max:50',
            'jam_buka' => 'nullable|date_format:H:i',
            'jam_tutup' => 'nullable|date_format:H:i|after:jam_buka',
            'status' => ['required', Rule::in(['active', 'inactive', 'holiday'])],
            'is_main' => 'boolean',
            'deskripsi' => 'nullable|string',
            'map_url' => 'nullable|url|max:255',
            'urutan' => 'nullable|integer',
        ]);

        // Jika is_main true, set semua lokasi lain menjadi false
        if ($validated['is_main']) {
            StoreLocation::where('is_main', true)
                ->where('id', '!=', $storeLocation->id)
                ->update(['is_main' => false]);
        }

        $storeLocation->update($validated);

        return redirect()->back()->with('success', 'Lokasi berhasil diupdate');
    }

    /**
     * Remove the specified location.
     */
    public function destroy(StoreLocation $storeLocation)
    {
        $this->authorizeAdmin();

        if ($storeLocation->is_main) {
            return redirect()->back()->with('error', 'Tidak dapat menghapus lokasi utama');
        }

        $storeLocation->delete();

        return redirect()->back()->with('success', 'Lokasi berhasil dihapus');
    }

    /**
     * Update location status
     */
    public function updateStatus(Request $request, StoreLocation $storeLocation)
    {
        $this->authorizeAdmin();

        $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'holiday'])],
        ]);

        $storeLocation->update(['status' => $request->status]);

        return redirect()->back()->with('success', 'Status lokasi berhasil diupdate');
    }

    /**
     * Reorder locations
     */
    public function reorder(Request $request)
    {
        $this->authorizeAdmin();

        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:store_locations,id',
            'orders.*.urutan' => 'required|integer',
        ]);

        foreach ($request->orders as $order) {
            StoreLocation::where('id', $order['id'])->update(['urutan' => $order['urutan']]);
        }

        return response()->json(['success' => true]);
    }
}