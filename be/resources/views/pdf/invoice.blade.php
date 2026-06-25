<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice #{{ $order->number }}</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 14px; color: #333; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
        .invoice-title { font-size: 24px; font-weight: bold; }
        .details { display: flex; justify-content: space-between; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
        th { background-color: #f8f9fa; }
        .text-right { text-align: right; }
        .totals { float: right; width: 50%; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="invoice-title">INVOICE</div>
            <div>Order #{{ $order->number }}</div>
            <div>Date: {{ $order->created_at->format('M d, Y') }}</div>
        </div>
        <div class="text-right">
            <strong>Ice Tea E-commerce</strong><br>
            123 Main Street<br>
            contact@icetea.com
        </div>
    </div>

    <div class="details">
        <div>
            <strong>Bill To:</strong><br>
            {{ $order->customer_name }}<br>
            {{ $order->customer_email }}<br>
            {{ $order->customer_phone }}<br>
            {{ $order->shipping_address }}
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->items as $item)
            <tr>
                <td>{{ $item->product?->name ?? 'Unknown Product' }}</td>
                <td>{{ $item->qty }}</td>
                <td>${{ number_format($item->price, 2) }}</td>
                <td class="text-right">${{ number_format($item->total_price, 2) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal</td>
                <td class="text-right">${{ number_format($order->items->sum('total_price'), 2) }}</td>
            </tr>
            <tr>
                <td>Shipping</td>
                <td class="text-right">${{ number_format($order->shipping_fee, 2) }}</td>
            </tr>
            <tr>
                <td>Tax</td>
                <td class="text-right">${{ number_format($order->tax_fee, 2) }}</td>
            </tr>
            <tr>
                <th>Total</th>
                <th class="text-right">${{ number_format($order->total_price, 2) }}</th>
            </tr>
        </table>
    </div>
</body>
</html>
