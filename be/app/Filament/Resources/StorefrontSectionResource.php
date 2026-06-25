<?php

namespace App\Filament\Resources;

use App\Filament\Resources\StorefrontSectionResource\Pages;
use App\Models\StorefrontSection;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class StorefrontSectionResource extends Resource
{
    protected static ?string $model = StorefrontSection::class;

    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static ?string $navigationGroup = 'Website';

    protected static ?string $navigationLabel = 'Content sections';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('key')
                ->disabled()
                ->dehydrated(false),
            Forms\Components\TextInput::make('label')
                ->disabled()
                ->dehydrated(false),
            Forms\Components\Textarea::make('content_json')
                ->label('JSON content')
                ->helperText('Edit bilingual storefront content. Invalid JSON will be rejected on save.')
                ->rows(24)
                ->required()
                ->columnSpanFull()
                ->extraAttributes(['class' => 'font-mono text-sm']),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('label')->searchable(),
                Tables\Columns\TextColumn::make('key')->badge(),
                Tables\Columns\TextColumn::make('updated_at')->dateTime()->sortable(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListStorefrontSections::route('/'),
            'edit' => Pages\EditStorefrontSection::route('/{record}/edit'),
        ];
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function canDelete($record): bool
    {
        return false;
    }
}
