<?php

namespace App\Filament\Resources\AppointmentResource\Pages;

use App\Filament\Resources\AppointmentResource;
use App\Services\Storefront\AppointmentService;
use Filament\Resources\Pages\EditRecord;

class EditAppointment extends EditRecord
{
    protected static string $resource = AppointmentResource::class;

    protected function afterSave(): void
    {
        if ($this->record->wasChanged('status')) {
            app(AppointmentService::class)->recordStatus(
                $this->record,
                $this->record->status,
                auth()->id(),
                'Updated in admin panel'
            );
        }
    }
}
