<?php

namespace App\Mail\Storefront;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdatedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(
        public Order $order,
        public string $previousStatus,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Cập nhật đơn hàng ' . $this->order->number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.storefront.order-status-updated',
            with: [
                'order' => $this->order,
                'previousStatus' => $this->previousStatus,
                'siteName' => config('storefront.site_name'),
            ],
        );
    }
}
