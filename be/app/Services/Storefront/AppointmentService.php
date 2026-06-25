<?php

namespace App\Services\Storefront;

use App\Models\Appointment;
use App\Models\AppointmentStatusHistory;
use App\Models\Customer;
use App\Models\Order;
use Illuminate\Support\Str;

class AppointmentService
{
    /**
     * @param  array{name: string, phone: string, email?: string, service?: string, staff_id?: int, preferred_date?: string, preferred_time?: string, note?: string}  $data
     */
    public function createFromBooking(array $data): Appointment
    {
        $phone = Customer::normalizePhone($data['phone']);
        $scheduledAt = null;

        if (! empty($data['preferred_date'])) {
            $time = $data['preferred_time'] ?? '09:00';
            $scheduledAt = \Illuminate\Support\Carbon::parse("{$data['preferred_date']} {$time}");
        }

        $customer = Customer::query()->where('phone', $phone)->first();

        $appointment = Appointment::create([
            'customer_id' => $customer?->id,
            'customer_name' => $data['name'],
            'customer_phone' => $phone,
            'customer_email' => $data['email'] ?? null,
            'service' => $data['service'] ?? null,
            'staff_id' => $data['staff_id'] ?? null,
            'scheduled_at' => $scheduledAt,
            'status' => Appointment::STATUS_PENDING,
            'notes' => $data['note'] ?? null,
            'metadata' => array_filter([
                'preferred_time' => $data['preferred_time'] ?? null,
            ]),
        ]);

        $this->recordStatus($appointment, Appointment::STATUS_PENDING, null, 'Booking submitted via website');

        if ($customer) {
            $appointment->update(['customer_id' => $customer->id]);
        }

        return $appointment;
    }

    public function linkAppointmentsToCustomer(Customer $customer): void
    {
        Appointment::query()
            ->whereNull('customer_id')
            ->where('customer_phone', $customer->phone)
            ->update(['customer_id' => $customer->id]);
    }

    public function linkOrdersToCustomer(Customer $customer): void
    {
        Order::query()
            ->whereNull('customer_id')
            ->where('customer_phone', $customer->phone)
            ->update(['customer_id' => $customer->id]);
    }

    public function recordStatus(Appointment $appointment, string $status, ?int $changedBy = null, ?string $notes = null): void
    {
        $appointment->update(['status' => $status]);

        AppointmentStatusHistory::create([
            'appointment_id' => $appointment->id,
            'status' => $status,
            'changed_by' => $changedBy,
            'notes' => $notes,
        ]);
    }

    /**
     * @return array{success: bool, message?: string}
     */
    public function cancelByCustomer(Appointment $appointment, Customer $customer): array
    {
        if ($appointment->customer_id !== $customer->id) {
            return ['success' => false, 'message' => 'Không tìm thấy lịch hẹn'];
        }

        if (in_array($appointment->status, [Appointment::STATUS_CANCELLED, Appointment::STATUS_COMPLETED], true)) {
            return ['success' => false, 'message' => 'Lịch hẹn không thể hủy'];
        }

        if ($appointment->scheduled_at && $appointment->scheduled_at->lte(now()->addHours(24))) {
            return ['success' => false, 'message' => 'Chỉ hủy được trước 24 giờ so với giờ hẹn'];
        }

        $this->recordStatus($appointment, Appointment::STATUS_CANCELLED, null, 'Cancelled by customer');

        return ['success' => true, 'message' => 'Đã hủy lịch hẹn'];
    }

    public function formatForApi(Appointment $appointment): array
    {
        return [
            'id' => $appointment->id,
            'service' => $appointment->service,
            'status' => $appointment->status,
            'scheduled_at' => $appointment->scheduled_at,
            'notes' => $appointment->notes,
            'created_at' => $appointment->created_at,
        ];
    }
}
