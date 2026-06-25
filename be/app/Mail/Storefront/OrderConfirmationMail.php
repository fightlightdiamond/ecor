<?php

namespace App\Mail\Storefront;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class OrderConfirmationMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Order $order) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Xác nhận đơn hàng ' . $this->order->number,
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.storefront.order-confirmation',
            with: [
                'order' => $this->order,
                'siteName' => config('storefront.site_name'),
            ],
        );
    }
}
