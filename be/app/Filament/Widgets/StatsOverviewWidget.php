<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Orders', \App\Models\Order::count())
                ->description('All orders ever placed')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('Total Revenue', '$' . number_format(\App\Models\Order::sum('total_price'), 2))
                ->description('Total revenue from orders')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success'),
            Stat::make('Total Products', \App\Models\Product::count())
                ->description('Total products available')
                ->color('primary'),
        ];
    }
}
