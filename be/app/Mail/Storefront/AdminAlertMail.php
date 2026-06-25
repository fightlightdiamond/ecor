<?php

namespace App\Mail\Storefront;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminAlertMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

  /**
   * @param  list<string>  $lines
   */
    public function __construct(
        public string $mailSubject,
        public string $heading,
        public array $lines,
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->mailSubject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'mail.storefront.admin-alert',
            with: [
                'heading' => $this->heading,
                'lines' => $this->lines,
                'siteName' => config('storefront.site_name'),
            ],
        );
    }
}
