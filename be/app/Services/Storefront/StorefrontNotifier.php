<?php

namespace App\Services\Storefront;

use App\Mail\Storefront\AdminAlertMail;
use App\Mail\Storefront\AppointmentConfirmedMail;
use App\Mail\Storefront\BookingReceivedMail;
use App\Mail\Storefront\OrderConfirmationMail;
use App\Mail\Storefront\OrderStatusUpdatedMail;
use App\Models\Appointment;
use App\Models\ContactInquiry;
use App\Models\Order;
use App\Models\User;
use Filament\Notifications\Notification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class StorefrontNotifier
{
    public function bookingCreated(Appointment $appointment): void
    {
        $when = $appointment->scheduled_at
            ? $appointment->scheduled_at->format('d/m/Y H:i')
            : 'Chưa chọn giờ';

        $body = "{$appointment->customer_name} · {$appointment->customer_phone} · {$when}";

        $this->notifyAdmins('Lịch hẹn mới', $body, 'heroicon-o-calendar-days');

        $this->queueMail(
            $appointment->customer_email,
            new BookingReceivedMail($appointment),
        );

        $this->queueMail(
            config('storefront.admin_email'),
            new AdminAlertMail(
                mailSubject: 'Lịch hẹn mới — ' . config('storefront.site_name'),
                heading: 'Yêu cầu đặt lịch mới',
                lines: [
                    "Khách: {$appointment->customer_name}",
                    "SĐT: {$appointment->customer_phone}",
                    "Email: " . ($appointment->customer_email ?: '—'),
                    "Dịch vụ: " . ($appointment->service ?: '—'),
                    "Thời gian: {$when}",
                    "Ghi chú: " . ($appointment->notes ?: '—'),
                ],
            ),
        );
    }

    public function orderCreated(Order $order): void
    {
        $total = number_format((float) $order->total_price, 0, ',', '.');

        $this->notifyAdmins(
            'Đơn hàng mới',
            "{$order->number} · {$order->customer_name} · {$total}đ",
            'heroicon-o-shopping-bag',
        );

        $order->loadMissing('items.product');

        if ($order->payment_method !== 'vnpay') {
            $this->queueMail(
                $order->customer_email,
                new OrderConfirmationMail($order),
            );
        }

        $this->queueMail(
            config('storefront.admin_email'),
            new AdminAlertMail(
                mailSubject: 'Đơn hàng mới — ' . $order->number,
                heading: 'Đơn hàng mới từ website',
                lines: [
                    "Mã đơn: {$order->number}",
                    "Khách: {$order->customer_name}",
                    "SĐT: {$order->customer_phone}",
                    "Email: " . ($order->customer_email ?: '—'),
                    "Địa chỉ: {$order->shipping_address}",
                    "Tổng: {$total}đ",
                ],
            ),
        );
    }

    public function contactReceived(ContactInquiry $inquiry): void
    {
        $this->queueMail(
            config('storefront.admin_email'),
            new AdminAlertMail(
                mailSubject: 'Liên hệ mới — ' . config('storefront.site_name'),
                heading: 'Tin nhắn từ form liên hệ',
                lines: [
                    "Tên: {$inquiry->name}",
                    "SĐT: {$inquiry->phone}",
                    "Email: " . ($inquiry->email ?: '—'),
                    "Dịch vụ: " . ($inquiry->service ?: '—'),
                    "Nội dung: " . ($inquiry->message ?: '—'),
                    "Nguồn: " . ($inquiry->source ?: 'website'),
                ],
            ),
        );
    }

    public function orderPaid(Order $order): void
    {
        $order->loadMissing('items.product');

        $this->queueMail(
            $order->customer_email,
            new OrderConfirmationMail($order),
        );
    }

    public function orderStatusChanged(Order $order, string $previousStatus): void
    {
        if (! in_array($order->status, ['shipped', 'delivered', 'cancelled'], true)) {
            return;
        }

        $this->queueMail(
            $order->customer_email,
            new OrderStatusUpdatedMail($order, $previousStatus),
        );
    }

    public function appointmentConfirmed(Appointment $appointment): void
    {
        $this->queueMail(
            $appointment->customer_email,
            new AppointmentConfirmedMail($appointment),
        );
    }

    private function notifyAdmins(string $title, string $body, string $icon): void
    {
        User::query()
            ->where('is_admin', true)
            ->get()
            ->each(fn (User $admin) => Notification::make()
                ->title($title)
                ->body($body)
                ->icon($icon)
                ->sendToDatabase($admin));
    }

    private function queueMail(?string $email, object $mailable): void
    {
        if (! $email || ! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return;
        }

        try {
            Mail::to($email)->queue($mailable);
        } catch (\Throwable $e) {
            Log::warning('Storefront mail failed', [
                'email' => $email,
                'mailable' => $mailable::class,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
