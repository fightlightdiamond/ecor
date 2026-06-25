<?php

namespace App\Filament\Resources\StorefrontSectionResource\Pages;

use App\Filament\Resources\StorefrontSectionResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListStorefrontSections extends ListRecords
{
    protected static string $resource = StorefrontSectionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('importAll')
                ->label('Import all from files')
                ->action(function () {
                    \App\Support\StorefrontContent::importFromFiles();
                    \Filament\Notifications\Notification::make()
                        ->title('Imported storefront sections')
                        ->success()
                        ->send();
                }),
        ];
    }
}
