<?php

namespace App\Filament\Widgets;

use App\Models\Appointment;
use App\Models\Customer;
use App\Models\Order;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        $todayOrders = Order::query()->whereDate('created_at', today())->count();
        $pendingAppointments = Appointment::query()
            ->where('status', Appointment::STATUS_PENDING)
            ->count();
        $todayAppointments = Appointment::query()
            ->whereDate('scheduled_at', today())
            ->whereNotIn('status', [Appointment::STATUS_CANCELLED])
            ->count();
        $revenue = Order::query()->where('status', '!=', 'cancelled')->sum('total_price');

        return [
            Stat::make('Lịch chờ xác nhận', $pendingAppointments)
                ->description('Pending appointments')
                ->descriptionIcon('heroicon-m-calendar')
                ->color('warning'),
            Stat::make('Lịch hôm nay', $todayAppointments)
                ->description('Scheduled today')
                ->descriptionIcon('heroicon-m-clock')
                ->color('info'),
            Stat::make('Đơn hôm nay', $todayOrders)
                ->description('New orders today')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('success'),
            Stat::make('Doanh thu', number_format((float) $revenue, 0, ',', '.') . 'đ')
                ->description(Customer::count() . ' khách hàng')
                ->descriptionIcon('heroicon-m-users')
                ->color('primary'),
        ];
    }
}
