<?php

namespace App\Mail\Storefront;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentConfirmedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public Appointment $appointment) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Lịch hẹn đã được xác nhận — ' . config('storefront.site_name'),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.storefront.appointment-confirmed',
            with: [
                'appointment' => $this->appointment,
                'siteName' => config('storefront.site_name'),
            ],
        );
    }
}
