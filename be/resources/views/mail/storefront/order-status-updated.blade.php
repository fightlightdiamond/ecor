<x-mail::message>
# Cập nhật trạng thái đơn hàng

Xin chào **{{ $order->customer_name }}**,

Đơn hàng **{{ $order->number }}** tại **{{ $siteName }}** đã được cập nhật.

**Trạng thái mới:** {{ $order->status }}

@if($order->tracking_number)
**Mã vận đơn:** {{ $order->tracking_number }}
@endif

Bạn có thể tra cứu đơn hàng trên website bằng mã đơn và số điện thoại.

Trân trọng,<br>
{{ $siteName }}
</x-mail::message>
