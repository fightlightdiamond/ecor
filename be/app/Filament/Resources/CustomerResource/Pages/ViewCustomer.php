<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use Filament\Infolists;
use Filament\Infolists\Infolist;
use Filament\Resources\Pages\ViewRecord;

class ViewCustomer extends ViewRecord
{
    protected static string $resource = CustomerResource::class;

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist->schema([
            Infolists\Components\TextEntry::make('name'),
            Infolists\Components\TextEntry::make('phone'),
            Infolists\Components\TextEntry::make('email'),
            Infolists\Components\TextEntry::make('created_at')->dateTime(),
        ]);
    }
}
