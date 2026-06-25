<x-mail::message>
# Xác nhận đơn hàng

Xin chào **{{ $order->customer_name }}**,

Cảm ơn bạn đã đặt hàng tại **{{ $siteName }}**.

**Mã đơn:** {{ $order->number }}

<x-mail::table>
| Sản phẩm | SL | Giá |
|:---------|:--:|----:|
@foreach($order->items as $item)
| {{ $item->product?->name ?? 'Sản phẩm' }} | {{ $item->qty }} | {{ number_format((float) $item->price, 0, ',', '.') }}đ |
@endforeach
</x-mail::table>

**Tổng thanh toán:** {{ number_format((float) $order->total_price, 0, ',', '.') }}đ

**Giao đến:** {{ $order->shipping_address }}

Bạn có thể tra cứu đơn hàng trên website bằng mã đơn và số điện thoại.

Trân trọng,<br>
{{ $siteName }}
</x-mail::message>
