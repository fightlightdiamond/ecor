<x-mail::message>
# Lịch hẹn đã được xác nhận

Xin chào **{{ $appointment->customer_name }}**,

Lịch hẹn của bạn tại **{{ $siteName }}** đã được xác nhận.

@if($appointment->scheduled_at)
**Thời gian:** {{ $appointment->scheduled_at->format('d/m/Y H:i') }}
@endif

@if($appointment->service)
**Dịch vụ:** {{ $appointment->service }}
@endif

Vui lòng đến đúng giờ hoặc liên hệ salon nếu cần thay đổi.

Trân trọng,<br>
{{ $siteName }}
</x-mail::message>
