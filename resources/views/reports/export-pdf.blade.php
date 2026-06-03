<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Detail</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #333;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0;
            color: #333;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            background-color: #4472C4;
            color: white;
            padding: 8px;
            margin: 15px 0 10px 0;
            font-weight: bold;
            font-size: 14px;
            border-radius: 3px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .text-red {
            color: red;
        }
        .text-green {
            color: green;
        }
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .summary-table td {
            border: none;
            padding: 5px;
        }
        .page-break {
            page-break-before: always;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN DETAIL KOPI POS</h1>
        <p>Periode: {{ $start_date }} s/d {{ $end_date }}</p>
        <p>Tanggal Cetak: {{ $generated_at }}</p>
        <p>Dicetak oleh: {{ $generated_by }}</p>
    </div>

    <!-- Ringkasan -->
    <div class="section">
        <div class="section-title">A. RINGKASAN PENJUALAN</div>
        <table class="summary-table">
            <tr>
                <td width="40%"><strong>Total Transaksi Penjualan</strong></td>
                <td width="60%">{{ number_format($total_transactions) }} transaksi</td>
            </tr>
            <tr>
                <td><strong>Total Penjualan</strong></td>
                <td class="text-green">Rp {{ number_format($total_sales, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Jumlah Transaksi Pengeluaran</strong></td>
                <td>{{ number_format($total_expense_transactions ?? 0) }} transaksi</td>
            </tr>
            <tr>
                <td><strong>Total Pengeluaran</strong></td>
                <td class="text-red">Rp {{ number_format($total_expenses, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td><strong>Pendapatan Bersih</strong></td>
                <td class="{{ $net_income < 0 ? 'text-red' : 'text-green' }}">
                    Rp {{ number_format($net_income, 0, ',', '.') }}
                </td>
            </tr>
        </table>
    </div>

    <!-- Produk Terlaris -->
    <div class="section">
        <div class="section-title">B. PRODUK TERLARIS</div>
        <table>
            <thead>
                <tr>
                    <th width="8%" class="text-center">No</th>
                    <th width="52%">Nama Produk</th>
                    <th width="20%" class="text-center">Terjual</th>
                    <th width="20%" class="text-right">Total Nominal</th>
                </tr>
            </thead>
            <tbody>
                @forelse($top_products as $index => $product)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td>{{ $product->nama_produk }}</td>
                    <td class="text-center">{{ number_format($product->total_terjual) }} pcs</td>
                    <td class="text-right">Rp {{ number_format($product->total_nominal, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center">Tidak ada data</td>
                </tr>
                @endforelse
            </tbody>
            @if(!$top_products->isEmpty())
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right"><strong>TOTAL</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($top_products->sum('total_nominal'), 0, ',', '.') }}</strong></td>
                </tr>
            </tfoot>
            @endif
        </table>
    </div>

    <!-- Metode Pembayaran -->
    <div class="section">
        <div class="section-title">C. METODE PEMBAYARAN</div>
        <table>
            <thead>
                <tr>
                    <th width="10%" class="text-center">No</th>
                    <th width="50%">Metode Pembayaran</th>
                    <th width="20%" class="text-center">Jumlah Transaksi</th>
                    <th width="20%" class="text-right">Total Nominal</th>
                </tr>
            </thead>
            <tbody>
                @forelse($payment_methods as $index => $method)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td>{{ $metode_labels[$method->metode_pembayaran] ?? $method->metode_pembayaran }}</td>
                    <td class="text-center">{{ number_format($method->jumlah) }}</td>
                    <td class="text-right">Rp {{ number_format($method->total, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center">Tidak ada data</td>
                </tr>
                @endforelse
            </tbody>
            @if(!$payment_methods->isEmpty())
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right"><strong>TOTAL</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($payment_methods->sum('total'), 0, ',', '.') }}</strong></td>
                </tr>
            </tfoot>
            @endif
        </table>
    </div>

    <!-- Penjualan Harian -->
    <div class="section">
        <div class="section-title">D. LAPORAN PENJUALAN</div>
        <table>
            <thead>
                <tr>
                    <th width="10%" class="text-center">No</th>
                    <th width="30%" class="text-center">Tanggal</th>
                    <th width="30%" class="text-center">Jumlah Transaksi</th>
                    <th width="30%" class="text-right">Total Penjualan</th>
                </tr>
            </thead>
            <tbody>
                @forelse($daily_sales as $index => $daily)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($daily->tanggal)->format('d/m/Y') }}</td>
                    <td class="text-center">{{ number_format($daily->jumlah_transaksi) }}</td>
                    <td class="text-right">Rp {{ number_format($daily->total_penjualan, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="4" class="text-center">Tidak ada data</td>
                </tr>
                @endforelse
            </tbody>
            @if(!$daily_sales->isEmpty())
            <tfoot>
                <tr>
                    <td colspan="3" class="text-right"><strong>TOTAL</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($daily_sales->sum('total_penjualan'), 0, ',', '.') }}</strong></td>
                </tr>
            </tfoot>
            @endif
        </table>
    </div>

    <!-- Pengeluaran -->
    <div class="section">
        <div class="section-title">E. LAPORAN PENGELUARAN</div>
        <table>
            <thead>
                <tr>
                    <th width="8%" class="text-center">No</th>
                    <th width="15%" class="text-center">Tanggal</th>
                    <th width="25%">Kategori</th>
                    <th width="32%">Keterangan</th>
                    <th width="20%" class="text-right">Nominal</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $expenses = App\Models\Expense::whereBetween('tanggal', [$start_date, $end_date])
                        ->orderBy('tanggal', 'desc')
                        ->get();
                    $totalPengeluaran = 0;
                @endphp
                @forelse($expenses as $index => $expense)
                @php $totalPengeluaran += $expense->nominal; @endphp
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($expense->tanggal)->format('d/m/Y') }}</td>
                    <td>{{ $expense->kategori_pengeluaran }}</td>
                    <td>{{ $expense->keterangan ?? '-' }}</td>
                    <td class="text-right">Rp {{ number_format($expense->nominal, 0, ',', '.') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="5" class="text-center">Tidak ada data pengeluaran</td>
                </tr>
                @endforelse
            </tbody>
            @if($expenses->isNotEmpty())
            <tfoot>
                <tr>
                    <td colspan="4" class="text-right"><strong>TOTAL PENGELUARAN</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($totalPengeluaran, 0, ',', '.') }}</strong></td>
                </tr>
            </tfoot>
            @endif
        </table>
    </div>

    <!-- Tutup Kas -->
    <div class="section">
        <div class="section-title">F. LAPORAN TUTUP KAS</div>
        <table>
            <thead>
                <tr>
                    <th width="5%" class="text-center">No</th>
                    <th width="10%" class="text-center">Tanggal</th>
                    <th width="15%" class="text-right">Total Penjualan</th>
                    <th width="10%" class="text-center">Total Transaksi</th>
                    <th width="15%" class="text-right">Total Pengeluaran</th>
                    <th width="15%" class="text-right">Pendapatan Bersih</th>
                    <th width="15%">Ditutup Oleh</th>
                    <th width="15%" class="text-center">Waktu Tutup</th>
                </tr>
            </thead>
            <tbody>
                @php
                    $closings = App\Models\CashClosing::with('user')
                        ->whereBetween('tanggal', [$start_date, $end_date])
                        ->orderBy('tanggal', 'desc')
                        ->orderBy('created_at', 'desc')
                        ->get();
                @endphp
                @forelse($closings as $index => $closing)
                <tr>
                    <td class="text-center">{{ $loop->iteration }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($closing->tanggal)->format('d/m/Y') }}</td>
                    <td class="text-right">Rp {{ number_format($closing->total_penjualan, 0, ',', '.') }}</td>
                    <td class="text-center">{{ number_format($closing->total_transaksi) }}</td>
                    <td class="text-right">Rp {{ number_format($closing->total_pengeluaran, 0, ',', '.') }}</td>
                    <td class="text-right {{ $closing->pendapatan_bersih < 0 ? 'text-red' : 'text-green' }}">
                        Rp {{ number_format($closing->pendapatan_bersih, 0, ',', '.') }}
                    </td>
                    <td>{{ $closing->user->name ?? 'Admin' }}</td>
                    <td class="text-center">{{ \Carbon\Carbon::parse($closing->created_at)->format('d/m/Y H:i:s') }}</td>
                </tr>
                @empty
                <tr>
                    <td colspan="8" class="text-center">Tidak ada data tutup kas</td>
                </tr>
                @endforelse
            </tbody>
            @if($closings->isNotEmpty())
            <tfoot>
                <tr>
                    <td colspan="2" class="text-right"><strong>TOTAL</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($closings->sum('total_penjualan'), 0, ',', '.') }}</strong></td>
                    <td class="text-center"><strong>{{ number_format($closings->sum('total_transaksi')) }}</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($closings->sum('total_pengeluaran'), 0, ',', '.') }}</strong></td>
                    <td class="text-right"><strong>Rp {{ number_format($closings->sum('pendapatan_bersih'), 0, ',', '.') }}</strong></td>
                    <td colspan="2"></td>
                </tr>
            </tfoot>
            @endif
        </table>
    </div>

    <div class="footer">
        <p>Dicetak oleh: {{ $generated_by }}</p>
        <p>TTD: _________________</p>
    </div>
</body>
</html>