<?php

namespace App\Filament\Widgets;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopProductsWidget extends BaseWidget
{
    protected static ?int $sort = 4;
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(
                \App\Models\Product::query()
                    ->withSum('orderItems as total_sold', 'qty')
                    ->orderByDesc('total_sold')
                    ->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Product Name'),
                Tables\Columns\TextColumn::make('price')->money('USD')->label('Price'),
                Tables\Columns\TextColumn::make('total_sold')->label('Units Sold')->badge()->color('success'),
            ])
            ->paginated(false);
    }
}
