<?php

namespace App\Filament\Widgets;

use App\Models\Appointment;
use Carbon\Carbon;
use Filament\Widgets\Widget;
use Illuminate\Support\Collection;

class AppointmentCalendarWidget extends Widget
{
    protected static string $view = 'filament.widgets.appointment-calendar';

    protected static ?int $sort = 3;

    protected int | string | array $columnSpan = 'full';

    public string $weekStart = '';

    public function mount(): void
    {
        $this->weekStart = now()->startOfWeek(Carbon::MONDAY)->toDateString();
    }

    public function previousWeek(): void
    {
        $this->weekStart = Carbon::parse($this->weekStart)->subWeek()->toDateString();
    }

    public function nextWeek(): void
    {
        $this->weekStart = Carbon::parse($this->weekStart)->addWeek()->toDateString();
    }

    public function thisWeek(): void
    {
        $this->weekStart = now()->startOfWeek(Carbon::MONDAY)->toDateString();
    }

    public function getWeekLabelProperty(): string
    {
        $start = Carbon::parse($this->weekStart);
        $end = $start->copy()->addDays(6);

        return $start->format('d/m') . ' – ' . $end->format('d/m/Y');
    }

    /**
     * @return Collection<int, Carbon>
     */
    public function getDaysProperty(): Collection
    {
        $start = Carbon::parse($this->weekStart)->startOfDay();

        return collect(range(0, 6))->map(fn (int $i) => $start->copy()->addDays($i));
    }

    /**
     * @return Collection<string, Collection<int, Appointment>>
     */
    public function getAppointmentsByDayProperty(): Collection
    {
        $start = Carbon::parse($this->weekStart)->startOfDay();
        $end = $start->copy()->addDays(6)->endOfDay();

        return Appointment::query()
            ->whereBetween('scheduled_at', [$start, $end])
            ->whereNotIn('status', [Appointment::STATUS_CANCELLED])
            ->orderBy('scheduled_at')
            ->get()
            ->groupBy(fn (Appointment $a) => $a->scheduled_at?->format('Y-m-d') ?? 'unscheduled');
    }
}
