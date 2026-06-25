<?php

namespace App\Services\Storefront;

use App\Models\Appointment;
use App\Models\ContactInquiry;
use Illuminate\Support\Carbon;

class BookingAvailabilityService
{
    /**
     * @return array<int, array{time: string, available: bool}>
     */
    public function slotsForDate(string $date): array
    {
        $day = Carbon::parse($date);
        $isWeekend = $day->isWeekend();
        $startHour = $isWeekend ? 8 : 9;
        $endHour = $isWeekend ? 22 : 21;

        $booked = collect()
            ->merge(
                ContactInquiry::query()
                    ->where('type', 'booking')
                    ->whereNotNull('preferred_at')
                    ->whereDate('preferred_at', $date)
                    ->pluck('preferred_at')
            )
            ->merge(
                Appointment::query()
                    ->whereNotNull('scheduled_at')
                    ->whereDate('scheduled_at', $date)
                    ->whereNotIn('status', [Appointment::STATUS_CANCELLED])
                    ->pluck('scheduled_at')
            )
            ->map(fn ($value) => Carbon::parse($value)->format('H:i'))
            ->filter()
            ->unique()
            ->all();

        $slots = [];

        for ($hour = $startHour; $hour < $endHour; $hour++) {
            foreach (['00', '30'] as $minute) {
                $time = sprintf('%02d:%s', $hour, $minute);
                $slots[] = [
                    'time' => $time,
                    'available' => ! in_array($time, $booked, true),
                ];
            }
        }

        return $slots;
    }
}
