<?php

namespace App\Observers;

use App\Models\Appointment;
use App\Services\Storefront\StorefrontNotifier;

class AppointmentObserver
{
    public function created(Appointment $appointment): void
    {
        app(StorefrontNotifier::class)->bookingCreated($appointment);
    }

    public function updated(Appointment $appointment): void
    {
        if (
            $appointment->wasChanged('status')
            && $appointment->status === Appointment::STATUS_CONFIRMED
        ) {
            app(StorefrontNotifier::class)->appointmentConfirmed($appointment);
        }
    }
}
