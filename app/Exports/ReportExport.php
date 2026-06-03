<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Color;

class ReportExport implements WithMultipleSheets
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function sheets(): array
    {
        return [
            'RINGKASAN' => new RingkasanSheet($this->startDate, $this->endDate, $this->data),
            'PRODUK TERLARIS' => new ProdukTerlarisSheet($this->startDate, $this->endDate, $this->data),
            'METODE PEMBAYARAN' => new MetodePembayaranSheet($this->startDate, $this->endDate, $this->data),
            'PENJUALAN HARIAN' => new PenjualanHarianSheet($this->startDate, $this->endDate, $this->data),
            'PENGELUARAN' => new LaporanPengeluaranSheet($this->startDate, $this->endDate, $this->data),
            'TUTUP KAS' => new TutupKasSheet($this->startDate, $this->endDate, $this->data),
        ];
    }
}

// ============================================================
// SHEET 1: RINGKASAN (dengan header lengkap)
// ============================================================
class RingkasanSheet implements FromArray, WithStyles, WithColumnWidths
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function array(): array
    {
        $rows = [];
        
        $rows[] = ['LAPORAN PENJUALAN KOPI POS'];
        $rows[] = [];
        $rows[] = ['Periode Laporan', ':', $this->startDate . ' s/d ' . $this->endDate];
        $rows[] = ['Tanggal Cetak', ':', now()->format('d/m/Y H:i:s')];
        $rows[] = ['Dicetak oleh', ':', $this->data['generated_by']];
        $rows[] = [];
        $rows[] = ['A. RINGKASAN PENJUALAN'];
        $rows[] = [];
        $rows[] = ['Total Transaksi Penjualan', ':', number_format($this->data['total_transactions']) . ' transaksi'];
        $rows[] = ['Total Penjualan', ':', 'Rp ' . number_format($this->data['total_sales'], 0, ',', '.')];
        $rows[] = ['Jumlah Transaksi Pengeluaran', ':', number_format($this->data['total_expense_transactions'] ?? 0) . ' transaksi'];
        $rows[] = ['Total Pengeluaran', ':', 'Rp ' . number_format($this->data['total_expenses'], 0, ',', '.')];
        $rows[] = ['Pendapatan Bersih', ':', 'Rp ' . number_format($this->data['net_income'], 0, ',', '.')];
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // Judul Utama
        $sheet->getStyle('A1')->getFont()->setBold(true);
        $sheet->getStyle('A1')->getFont()->setSize(14);
        
        // Section Header A. RINGKASAN PENJUALAN (Baris 7)
        $sheet->getStyle('A7:C7')->getFont()->setBold(true);
        $sheet->getStyle('A7:C7')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FF0000'); // Hijau
        $sheet->getStyle('A7:C7')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        // Section Header A. RINGKASAN PENJUALAN (Baris 9)
        $sheet->getStyle('A9:C9')->getFont()->setBold(true);
        $sheet->getStyle('A9:C9')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('00FF00'); // Merah
        $sheet->getStyle('A9:C9')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        // Warna khusus untuk Pendapatan Bersih (Baris 13)
        $sheet->getStyle('A10:C10')->getFont()->setBold(true);
        if ($this->data['net_income'] < 0) {
            $sheet->getStyle('C10')->getFont()->getColor()->setARGB('00FF00'); // Merah jika rugi
        } else {
            $sheet->getStyle('C10')->getFont()->getColor()->setARGB('FF0000'); // Hijau jika laba
        }
        
        // Lebar kolom
        $sheet->getColumnDimension('A')->setWidth(28);
        $sheet->getColumnDimension('B')->setWidth(5);
        $sheet->getColumnDimension('C')->setWidth(30);
    }

    public function columnWidths(): array
    {
        return [
            'A' => 28,
            'B' => 5,
            'C' => 30,
        ];
    }
}

// ============================================================
// SHEET 2: PRODUK TERLARIS
// ============================================================
class ProdukTerlarisSheet implements FromArray, WithStyles, WithColumnWidths, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function array(): array
    {
        $rows = [];
        
        $rows[] = ['No', 'Nama Produk', 'Terjual', 'Total Nominal'];
        
        $totalNominal = 0;
        foreach ($this->data['top_products'] as $index => $product) {
            $rows[] = [
                $index + 1,
                $product->nama_produk,
                number_format($product->total_terjual) . ' pcs',
                'Rp ' . number_format($product->total_nominal, 0, ',', '.')
            ];
            $totalNominal += $product->total_nominal;
        }
        
        if (!$this->data['top_products']->isEmpty()) {
            $rows[] = ['', '', 'TOTAL', 'Rp ' . number_format($totalNominal, 0, ',', '.')];
        } else {
            $rows[] = ['-', 'Tidak ada data', '-', '-'];
        }
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);
        $sheet->getStyle('A1:D1')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FF4472C4');
        $sheet->getStyle('A1:D1')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:D' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        $totalRow = 1 + $this->data['top_products']->count() + 1;
        if (!$this->data['top_products']->isEmpty()) {
            $sheet->getStyle('A' . $totalRow . ':D' . $totalRow)->getFont()->setBold(true);
            $sheet->getStyle('A' . $totalRow . ':D' . $totalRow)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FFF2F2F2');
        }
        
        $sheet->getStyle('A:A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C:C')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('D:D')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        
        $sheet->getColumnDimension('A')->setWidth(8);
        $sheet->getColumnDimension('B')->setWidth(45);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(25);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->setAutoFilter('A1:D1');
            },
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 8,
            'B' => 45,
            'C' => 20,
            'D' => 25,
        ];
    }
}

// ============================================================
// SHEET 3: METODE PEMBAYARAN
// ============================================================
class MetodePembayaranSheet implements FromArray, WithStyles, WithColumnWidths, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function array(): array
    {
        $rows = [];
        
        $rows[] = ['No', 'Metode Pembayaran', 'Jumlah Transaksi', 'Total Nominal'];
        
        $totalPayment = 0;
        foreach ($this->data['payment_methods'] as $index => $method) {
            $label = $this->data['metode_labels'][$method->metode_pembayaran] ?? $method->metode_pembayaran;
            $rows[] = [
                $index + 1,
                $label,
                number_format($method->jumlah),
                'Rp ' . number_format($method->total, 0, ',', '.')
            ];
            $totalPayment += $method->total;
        }
        
        if (!$this->data['payment_methods']->isEmpty()) {
            $rows[] = ['', '', 'TOTAL', 'Rp ' . number_format($totalPayment, 0, ',', '.')];
        } else {
            $rows[] = ['-', 'Tidak ada data', '-', '-'];
        }
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);
        $sheet->getStyle('A1:D1')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FF4472C4');
        $sheet->getStyle('A1:D1')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:D' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        $totalRow = 1 + $this->data['payment_methods']->count() + 1;
        if (!$this->data['payment_methods']->isEmpty()) {
            $sheet->getStyle('A' . $totalRow . ':D' . $totalRow)->getFont()->setBold(true);
            $sheet->getStyle('A' . $totalRow . ':D' . $totalRow)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FFF2F2F2');
        }
        
        $sheet->getStyle('A:A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C:C')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('D:D')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        
        $sheet->getColumnDimension('A')->setWidth(8);
        $sheet->getColumnDimension('B')->setWidth(35);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(25);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->setAutoFilter('A1:D1');
            },
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 8,
            'B' => 35,
            'C' => 20,
            'D' => 25,
        ];
    }
}

// ============================================================
// SHEET 4: PENJUALAN HARIAN
// ============================================================
class PenjualanHarianSheet implements FromArray, WithStyles, WithColumnWidths, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function array(): array
    {
        $rows = [];
        
        $rows[] = ['No', 'Tanggal', 'Jumlah Transaksi', 'Total Penjualan'];
        
        $totalPenjualan = 0;
        foreach ($this->data['daily_sales'] as $index => $daily) {
            $rows[] = [
                $index + 1,
                date('d/m/Y', strtotime($daily->tanggal)),
                number_format($daily->jumlah_transaksi),
                'Rp ' . number_format($daily->total_penjualan, 0, ',', '.')
            ];
            $totalPenjualan += $daily->total_penjualan;
        }
        
        if (!$this->data['daily_sales']->isEmpty()) {
            $rows[] = ['', '', 'TOTAL', 'Rp ' . number_format($totalPenjualan, 0, ',', '.')];
        } else {
            $rows[] = ['-', 'Tidak ada data', '-', '-'];
        }
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:D1')->getFont()->setBold(true);
        $sheet->getStyle('A1:D1')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FF4472C4');
        $sheet->getStyle('A1:D1')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:D' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        $totalRow = 1 + $this->data['daily_sales']->count() + 1;
        if (!$this->data['daily_sales']->isEmpty()) {
            $sheet->getStyle('A' . $totalRow . ':D' . $totalRow)->getFont()->setBold(true);
            $sheet->getStyle('A' . $totalRow . ':D' . $totalRow)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FFF2F2F2');
        }
        
        $sheet->getStyle('A:A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('B:B')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C:C')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('D:D')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        
        $sheet->getColumnDimension('A')->setWidth(8);
        $sheet->getColumnDimension('B')->setWidth(15);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(25);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->setAutoFilter('A1:D1');
            },
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 8,
            'B' => 15,
            'C' => 20,
            'D' => 25,
        ];
    }
}

// ============================================================
// SHEET 5: PENGELUARAN
// ============================================================
class LaporanPengeluaranSheet implements FromArray, WithStyles, WithColumnWidths, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function array(): array
    {
        $rows = [];
        
        $rows[] = ['No', 'Tanggal', 'Kategori', 'Keterangan', 'Nominal'];
        
        $totalPengeluaran = 0;
        
        $expenses = \App\Models\Expense::whereBetween('tanggal', [$this->startDate, $this->endDate])
            ->orderBy('tanggal', 'desc')
            ->get();
        
        foreach ($expenses as $index => $expense) {
            $rows[] = [
                $index + 1,
                date('d/m/Y', strtotime($expense->tanggal)),
                $expense->kategori_pengeluaran,
                $expense->keterangan ?? '-',
                'Rp ' . number_format($expense->nominal, 0, ',', '.')
            ];
            $totalPengeluaran += $expense->nominal;
        }
        
        if ($expenses->isNotEmpty()) {
            $rows[] = ['', '', '', 'TOTAL', 'Rp ' . number_format($totalPengeluaran, 0, ',', '.')];
        } else {
            $rows[] = ['-', '-', 'Tidak ada data', '-', '-'];
        }
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:E1')->getFont()->setBold(true);
        $sheet->getStyle('A1:E1')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FF4472C4');
        $sheet->getStyle('A1:E1')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:E' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        $expensesCount = \App\Models\Expense::whereBetween('tanggal', [$this->startDate, $this->endDate])->count();
        $totalRow = 1 + $expensesCount + 1;
        if ($expensesCount > 0) {
            $sheet->getStyle('A' . $totalRow . ':E' . $totalRow)->getFont()->setBold(true);
            $sheet->getStyle('A' . $totalRow . ':E' . $totalRow)->getFill()
                ->setFillType(Fill::FILL_SOLID)
                ->getStartColor()->setARGB('FFF2F2F2');
        }
        
        $sheet->getStyle('A:A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('B:B')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E:E')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle('C:C')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle('D:D')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        
        $sheet->getColumnDimension('A')->setWidth(8);
        $sheet->getColumnDimension('B')->setWidth(15);
        $sheet->getColumnDimension('C')->setWidth(25);
        $sheet->getColumnDimension('D')->setWidth(35);
        $sheet->getColumnDimension('E')->setWidth(25);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $event->sheet->getDelegate()->setAutoFilter('A1:E1');
            },
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 8,
            'B' => 15,
            'C' => 25,
            'D' => 35,
            'E' => 25,
        ];
    }
}

// ============================================================
// SHEET 6: TUTUP KAS
// ============================================================
class TutupKasSheet implements FromArray, WithStyles, WithColumnWidths, WithEvents
{
    protected $startDate;
    protected $endDate;
    protected $data;

    public function __construct($startDate, $endDate, $data)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->data = $data;
    }

    public function array(): array
    {
        $rows = [];
        
        // Langsung header tabel tanpa judul
        $rows[] = ['No', 'Tanggal', 'Total Penjualan', 'Total Transaksi', 'Total Pengeluaran', 'Pendapatan Bersih', 'Ditutup Oleh', 'Waktu Tutup'];
        
        $closings = \App\Models\CashClosing::with('user')
            ->whereBetween('tanggal', [$this->startDate, $this->endDate])
            ->orderBy('tanggal', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();
        
        foreach ($closings as $index => $closing) {
            // Warna merah untuk pendapatan bersih jika minus
            $pendapatanBersih = 'Rp ' . number_format($closing->pendapatan_bersih, 0, ',', '.');
            
            $rows[] = [
                $index + 1,
                date('d/m/Y', strtotime($closing->tanggal)),
                'Rp ' . number_format($closing->total_penjualan, 0, ',', '.'),
                number_format($closing->total_transaksi),
                'Rp ' . number_format($closing->total_pengeluaran, 0, ',', '.'),
                $pendapatanBersih,
                $closing->user->name ?? 'Admin',
                date('d/m/Y H:i:s', strtotime($closing->created_at)),
            ];
        }
        
        if ($closings->isEmpty()) {
            $rows[] = ['-', 'Tidak ada data tutup kas', '-', '-', '-', '-', '-', '-'];
        }
        
        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // Header tabel (baris 1)
        $sheet->getStyle('A1:H1')->getFont()->setBold(true);
        $sheet->getStyle('A1:H1')->getFill()
            ->setFillType(Fill::FILL_SOLID)
            ->getStartColor()->setARGB('FF4472C4');
        $sheet->getStyle('A1:H1')->getFont()->getColor()->setARGB('FFFFFFFF');
        
        // Border untuk seluruh tabel
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle('A1:H' . $lastRow)->getBorders()->getAllBorders()
            ->setBorderStyle(Border::BORDER_THIN);
        
        // Warna merah untuk pendapatan bersih jika minus
        $closings = \App\Models\CashClosing::whereBetween('tanggal', [$this->startDate, $this->endDate])->get();
        $row = 2; // mulai dari baris 2 (setelah header)
        foreach ($closings as $closing) {
            if ($closing->pendapatan_bersih < 0) {
                $sheet->getStyle('F' . $row)->getFont()->getColor()->setARGB('FFFF0000');
            }
            $row++;
        }
        
        // Alignment
        $sheet->getStyle('A:A')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('B:B')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('C:C')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle('D:D')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        $sheet->getStyle('E:E')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle('F:F')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        $sheet->getStyle('G:G')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $sheet->getStyle('H:H')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
        
        // Lebar kolom
        $sheet->getColumnDimension('A')->setWidth(6);
        $sheet->getColumnDimension('B')->setWidth(12);
        $sheet->getColumnDimension('C')->setWidth(20);
        $sheet->getColumnDimension('D')->setWidth(15);
        $sheet->getColumnDimension('E')->setWidth(20);
        $sheet->getColumnDimension('F')->setWidth(20);
        $sheet->getColumnDimension('G')->setWidth(20);
        $sheet->getColumnDimension('H')->setWidth(18);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                // Auto filter untuk header tabel (baris 1)
                $event->sheet->getDelegate()->setAutoFilter('A1:H1');
            },
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,
            'B' => 12,
            'C' => 20,
            'D' => 15,
            'E' => 20,
            'F' => 20,
            'G' => 20,
            'H' => 18,
        ];
    }
}