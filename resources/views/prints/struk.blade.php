<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Struk Transaksi - {{ $transaction->no_transaksi }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Courier New', 'Lucida Console', monospace;
            font-size: 11px;
            line-height: 1.3;
            color: #000;
            background: #fff;
            padding: 10px;
        }
        
        .struk {
            max-width: 280px;
            margin: 0 auto;
            background: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #000;
        }
        
        .header h1 {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 3px;
        }
        
        .header p {
            font-size: 9px;
            margin: 1px 0;
        }
        
        .info {
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #000;
        }
        
        .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        
        .info-label {
            font-weight: bold;
        }
        
        .items {
            margin-bottom: 10px;
        }
        
        .items-header {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            margin-bottom: 5px;
            padding-bottom: 3px;
            border-bottom: 1px dotted #000;
        }
        
        .item-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
        }
        
        .item-name {
            flex: 2;
            word-break: break-word;
            padding-right: 5px;
        }
        
        .item-qty {
            width: 30px;
            text-align: center;
        }
        
        .item-price {
            width: 65px;
            text-align: right;
            padding-right: 5px;
        }
        
        .item-subtotal {
            width: 65px;
            text-align: right;
        }
        
        .totals {
            margin-bottom: 10px;
            padding-top: 5px;
            border-top: 1px dashed #000;
        }
        
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 3px;
        }
        
        .grand-total {
            font-weight: bold;
            font-size: 13px;
            margin-top: 5px;
            padding-top: 5px;
            border-top: 1px dashed #000;
        }
        
        .payment {
            margin-bottom: 10px;
            padding: 8px 0;
            border-top: 1px dashed #000;
            border-bottom: 1px dashed #000;
        }
        
        .footer {
            text-align: center;
            margin-top: 10px;
            padding-top: 8px;
            border-top: 1px dashed #000;
        }
        
        .footer p {
            font-size: 9px;
            margin: 2px 0;
        }
        
        .thankyou {
            text-align: center;
            margin-top: 8px;
            font-weight: bold;
            font-size: 10px;
        }
        
        @media print {
            body {
                padding: 0;
                margin: 0;
            }
            .struk {
                max-width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="struk">
        <!-- Header -->
        <div class="header">
            <h1>KOPI POS</h1>
            <p>Jl. Contoh No. 123, Kota Contoh</p>
            <p>Telp: (021) 1234-5678</p>
        </div>

        <!-- Info Transaksi -->
        <div class="info">
            <div class="info-row">
                <span class="info-label">No. Transaksi:</span>
                <span>{{ $transaction->no_transaksi }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Tanggal:</span>
                <span>{{ \Carbon\Carbon::parse($transaction->created_at)->format('d/m/Y H:i:s') }}</span>
            </div>
            @if($transaction->atas_nama)
            <div class="info-row">
                <span class="info-label">Atas Nama:</span>
                <span>{{ $transaction->atas_nama }}</span>
            </div>
            @endif
            <div class="info-row">
                <span class="info-label">Kasir:</span>
                <span>{{ $transaction->user->name ?? 'Admin' }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Metode:</span>
                <span>
                    @if($transaction->metode_pembayaran == 'tunai')
                        Tunai
                    @elseif($transaction->metode_pembayaran == 'qris')
                        QRIS
                    @else
                        Transfer Bank
                    @endif
                </span>
            </div>
        </div>

        <!-- Item Belanja -->
        <div class="items">
            <div class="items-header">
                <span class="item-name">Item</span>
                <span class="item-qty">Qty</span>
                <span class="item-price">Harga</span>
                <span class="item-subtotal">Total</span>
            </div>
            
            @foreach($transaction->details as $item)
            <div class="item-row">
                <span class="item-name">{{ $item->product->nama_produk }}</span>
                <span class="item-qty">{{ $item->jumlah }}</span>
                <span class="item-price">{{ number_format($item->harga, 0, ',', '.') }}</span>
                <span class="item-subtotal">{{ number_format($item->subtotal, 0, ',', '.') }}</span>
            </div>
            @endforeach
        </div>

        <!-- Total -->
        <div class="totals">
            <div class="total-row">
                <span>Subtotal:</span>
                <span>{{ number_format($transaction->subtotal, 0, ',', '.') }}</span>
            </div>
            @if($transaction->diskon > 0)
            <div class="total-row">
                <span>Diskon:</span>
                <span>{{ number_format($transaction->diskon, 0, ',', '.') }}</span>
            </div>
            @endif
            <div class="total-row grand-total">
                <span>TOTAL:</span>
                <span>{{ number_format($transaction->total, 0, ',', '.') }}</span>
            </div>
        </div>

        <!-- Pembayaran -->
        <div class="payment">
            <div class="total-row">
                <span>Bayar:</span>
                <span>{{ number_format($transaction->bayar, 0, ',', '.') }}</span>
            </div>
            <div class="total-row">
                <span>Kembali:</span>
                <span>{{ number_format($transaction->kembalian, 0, ',', '.') }}</span>
            </div>
        </div>

        <!-- Catatan -->
        @if($transaction->catatan)
        <div class="info">
            <div class="info-row">
                <span class="info-label">Catatan:</span>
                <span>{{ $transaction->catatan }}</span>
            </div>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <p>Terima kasih telah berbelanja!</p>
            <p>Struk ini sebagai bukti pembayaran</p>
        </div>
        
        <div class="thankyou">
            <p>~ Selamat Belanja Kembali ~</p>
        </div>
    </div>
</body>
</html>