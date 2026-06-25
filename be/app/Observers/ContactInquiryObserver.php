<?php

namespace App\Observers;

use App\Models\ContactInquiry;
use App\Services\Storefront\StorefrontNotifier;

class ContactInquiryObserver
{
    public function created(ContactInquiry $inquiry): void
    {
        if ($inquiry->type !== 'contact') {
            return;
        }

        app(StorefrontNotifier::class)->contactReceived($inquiry);
    }
}
