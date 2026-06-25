<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AppointmentResource\Pages;
use App\Models\Appointment;
use App\Services\Storefront\AppointmentService;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AppointmentResource extends Resource
{
    protected static ?string $model = Appointment::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar-days';

    protected static ?string $navigationGroup = 'Customer Support';

    protected static ?int $navigationSort = 0;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Forms\Components\TextInput::make('customer_name')->required(),
            Forms\Components\TextInput::make('customer_phone')->required(),
            Forms\Components\TextInput::make('customer_email'),
            Forms\Components\TextInput::make('service'),
            Forms\Components\DateTimePicker::make('scheduled_at'),
            Forms\Components\Select::make('status')
                ->options([
                    Appointment::STATUS_PENDING => 'Pending',
                    Appointment::STATUS_CONFIRMED => 'Confirmed',
                    Appointment::STATUS_COMPLETED => 'Completed',
                    Appointment::STATUS_CANCELLED => 'Cancelled',
                ])
                ->required(),
            Forms\Components\Textarea::make('notes')->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('scheduled_at')->dateTime()->sortable(),
                Tables\Columns\TextColumn::make('customer_name')->searchable(),
                Tables\Columns\TextColumn::make('customer_phone')->searchable(),
                Tables\Columns\TextColumn::make('service')->toggleable(),
                Tables\Columns\TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        Appointment::STATUS_PENDING => 'warning',
                        Appointment::STATUS_CONFIRMED => 'success',
                        Appointment::STATUS_COMPLETED => 'primary',
                        Appointment::STATUS_CANCELLED => 'danger',
                        default => 'gray',
                    }),
                Tables\Columns\TextColumn::make('created_at')->dateTime()->sortable(),
            ])
            ->defaultSort('scheduled_at', 'desc')
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options([
                    Appointment::STATUS_PENDING => 'Pending',
                    Appointment::STATUS_CONFIRMED => 'Confirmed',
                    Appointment::STATUS_COMPLETED => 'Completed',
                    Appointment::STATUS_CANCELLED => 'Cancelled',
                ]),
                Tables\Filters\Filter::make('today')
                    ->label('Today')
                    ->query(fn ($query) => $query->whereDate('scheduled_at', today())),
                Tables\Filters\Filter::make('this_week')
                    ->label('This week')
                    ->query(fn ($query) => $query->whereBetween('scheduled_at', [
                        now()->startOfWeek(),
                        now()->endOfWeek(),
                    ])),
            ])
            ->actions([
                Tables\Actions\Action::make('confirm')
                    ->label('Confirm')
                    ->icon('heroicon-o-check')
                    ->color('success')
                    ->visible(fn (Appointment $record) => $record->status === Appointment::STATUS_PENDING)
                    ->action(function (Appointment $record) {
                        app(AppointmentService::class)->recordStatus(
                            $record,
                            Appointment::STATUS_CONFIRMED,
                            auth()->id(),
                            'Confirmed from list'
                        );
                    }),
                Tables\Actions\Action::make('cancel')
                    ->label('Cancel')
                    ->icon('heroicon-o-x-mark')
                    ->color('danger')
                    ->requiresConfirmation()
                    ->visible(fn (Appointment $record) => ! in_array($record->status, [Appointment::STATUS_CANCELLED, Appointment::STATUS_COMPLETED], true))
                    ->action(function (Appointment $record) {
                        app(AppointmentService::class)->recordStatus(
                            $record,
                            Appointment::STATUS_CANCELLED,
                            auth()->id(),
                            'Cancelled from list'
                        );
                    }),
                Tables\Actions\EditAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListAppointments::route('/'),
            'edit' => Pages\EditAppointment::route('/{record}/edit'),
        ];
    }
}
