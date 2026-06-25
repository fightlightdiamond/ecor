<?php

namespace App\Filament\Resources\ApiTokenResource\Pages;

use App\Filament\Resources\ApiTokenResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use App\Models\User;
use Illuminate\Support\HtmlString;

class ListApiTokens extends ListRecords
{
    protected static string $resource = ApiTokenResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('createToken')
                ->label('Create Token')
                ->icon('heroicon-o-plus')
                ->form([
                    Select::make('user_id')
                        ->label('User')
                        ->options(User::pluck('name', 'id'))
                        ->required()
                        ->searchable(),
                    TextInput::make('name')
                        ->label('Token Name')
                        ->required(),
                ])
                ->action(function (array $data, \Filament\Actions\Action $action) {
                    $user = User::find($data['user_id']);
                    $token = $user->createToken($data['name']);
                    
                    \Filament\Notifications\Notification::make()
                        ->title('Token Created')
                        ->body(new HtmlString('Please copy your token: <strong>' . $token->plainTextToken . '</strong><br>It will only be shown once!'))
                        ->success()
                        ->persistent()
                        ->send();
                }),
        ];
    }
}
