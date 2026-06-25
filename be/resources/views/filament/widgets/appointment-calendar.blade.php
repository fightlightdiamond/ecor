<x-filament-widgets::widget>
    <x-filament::section>
        <x-slot name="heading">
            Lịch hẹn theo tuần
        </x-slot>

        <x-slot name="headerEnd">
            <div class="flex items-center gap-2">
                <x-filament::button size="sm" color="gray" wire:click="thisWeek">
                    Tuần này
                </x-filament::button>
                <x-filament::icon-button
                    icon="heroicon-m-chevron-left"
                    label="Tuần trước"
                    wire:click="previousWeek"
                />
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200 min-w-[10rem] text-center">
                    {{ $this->weekLabel }}
                </span>
                <x-filament::icon-button
                    icon="heroicon-m-chevron-right"
                    label="Tuần sau"
                    wire:click="nextWeek"
                />
            </div>
        </x-slot>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
            @foreach ($this->days as $day)
                @php
                    $key = $day->format('Y-m-d');
                    $dayAppointments = $this->appointmentsByDay->get($key, collect());
                    $isToday = $day->isToday();
                @endphp
                <div @class([
                    'rounded-lg border p-3 min-h-[8rem]',
                    'border-primary-500 bg-primary-50/50 dark:bg-primary-500/10' => $isToday,
                    'border-gray-200 dark:border-gray-700' => ! $isToday,
                ])>
                    <div class="mb-2">
                        <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {{ $day->translatedFormat('D') }}
                        </p>
                        <p @class([
                            'text-sm font-semibold',
                            'text-primary-600 dark:text-primary-400' => $isToday,
                        ])>
                            {{ $day->format('d/m') }}
                        </p>
                    </div>

                    @forelse ($dayAppointments as $appointment)
                        <a
                            href="{{ \App\Filament\Resources\AppointmentResource::getUrl('edit', ['record' => $appointment]) }}"
                            @class([
                                'block mb-2 rounded-md px-2 py-1.5 text-xs border transition',
                                'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-500/10 dark:border-warning-500/30' => $appointment->status === \App\Models\Appointment::STATUS_PENDING,
                                'bg-success-50 border-success-200 text-success-800 dark:bg-success-500/10 dark:border-success-500/30' => $appointment->status === \App\Models\Appointment::STATUS_CONFIRMED,
                                'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600' => ! in_array($appointment->status, [\App\Models\Appointment::STATUS_PENDING, \App\Models\Appointment::STATUS_CONFIRMED], true),
                            ])
                        >
                            <span class="font-medium">{{ $appointment->scheduled_at?->format('H:i') }}</span>
                            <span class="block truncate">{{ $appointment->customer_name }}</span>
                            @if ($appointment->service)
                                <span class="block truncate text-[10px] opacity-75">{{ $appointment->service }}</span>
                            @endif
                        </a>
                    @empty
                        <p class="text-xs text-gray-400 dark:text-gray-500">—</p>
                    @endforelse
                </div>
            @endforeach
        </div>
    </x-filament::section>
</x-filament-widgets::widget>
