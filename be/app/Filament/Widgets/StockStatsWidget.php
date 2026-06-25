<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StockStatsWidget extends BaseWidget
{
    protected static ?int $sort = 2;

    protected function getStats(): array
    {
        $totalProducts = \App\Models\Product::count();
        $lowStock = \App\Models\Product::where('stock', '<', 5)->where('stock', '>', 0)->count();
        $outOfStock = \App\Models\Product::where('stock', 0)->count();

        return [
            Stat::make('Total Products', $totalProducts)
                ->icon('heroicon-o-cube'),
            Stat::make('Low Stock Products', $lowStock)
                ->icon('heroicon-o-exclamation-triangle')
                ->color('warning'),
            Stat::make('Out of Stock', $outOfStock)
                ->icon('heroicon-o-x-circle')
                ->color('danger'),
        ];
    }
}
