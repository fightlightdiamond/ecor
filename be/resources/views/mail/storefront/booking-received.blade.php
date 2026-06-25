<x-mail::message>
# Đã nhận yêu cầu đặt lịch

Xin chào **{{ $appointment->customer_name }}**,

Chúng tôi đã nhận yêu cầu đặt lịch của bạn tại **{{ $siteName }}**. Nhân viên sẽ liên hệ xác nhận trong thời gian sớm nhất.

@if($appointment->scheduled_at)
**Thời gian mong muốn:** {{ $appointment->scheduled_at->format('d/m/Y H:i') }}
@endif

@if($appointment->service)
**Dịch vụ:** {{ $appointment->service }}
@endif

@if($appointment->notes)
**Ghi chú:** {{ $appointment->notes }}
@endif

Cảm ơn bạn đã tin tưởng {{ $siteName }}.

Trân trọng,<br>
{{ $siteName }}
</x-mail::message>
