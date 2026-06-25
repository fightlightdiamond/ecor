<?php

namespace App\Filament\Resources\StorefrontSectionResource\Pages;

use App\Filament\Resources\StorefrontSectionResource;
use Filament\Actions;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditStorefrontSection extends EditRecord
{
    protected static string $resource = StorefrontSectionResource::class;

    protected function mutateFormDataBeforeFill(array $data): array
    {
        $data['content_json'] = json_encode(
            $data['content'] ?? [],
            JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );

        return $data;
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $decoded = json_decode((string) ($data['content_json'] ?? ''), true);

        if (json_last_error() !== JSON_ERROR_NONE || ! is_array($decoded)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'content_json' => 'Invalid JSON: ' . json_last_error_msg(),
            ]);
        }

        return [
            'content' => $decoded,
        ];
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('importFromFile')
                ->label('Reset from JSON file')
                ->color('warning')
                ->requiresConfirmation()
                ->action(function () {
                    $key = $this->record->key;
                    $path = resource_path("data/storefront/{$key}.json");

                    if (! is_file($path)) {
                        Notification::make()->title('File not found')->danger()->send();

                        return;
                    }

                    $decoded = json_decode((string) file_get_contents($path), true);

                    if (! is_array($decoded)) {
                        Notification::make()->title('Invalid JSON file')->danger()->send();

                        return;
                    }

                    $this->record->update(['content' => $decoded]);
                    $this->fillForm();

                    Notification::make()->title('Restored from file')->success()->send();
                }),
        ];
    }
}
