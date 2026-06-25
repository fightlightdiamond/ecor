<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Customer;
use App\Services\Storefront\AppointmentService;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class CustomerAppointmentController extends Controller
{
    #[OA\Get(
        path: '/api/customer/appointments',
        operationId: 'customerAppointments',
        summary: 'List my appointments',
        tags: ['Customer'],
        security: [['customerBearer' => []]],
        responses: [new OA\Response(response: 200, description: 'Appointment list')]
    )]
    public function index(Request $request, AppointmentService $appointments)
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $items = Appointment::query()
            ->where('customer_id', $customer->id)
            ->latest('scheduled_at')
            ->get()
            ->map(fn (Appointment $a) => $appointments->formatForApi($a));

        return response()->json([
            'success' => true,
            'data' => $items,
        ]);
    }

    #[OA\Delete(
        path: '/api/customer/appointments/{id}',
        operationId: 'cancelCustomerAppointment',
        summary: 'Cancel appointment (>24h before scheduled time)',
        tags: ['Customer'],
        security: [['customerBearer' => []]],
        parameters: [
            new OA\Parameter(name: 'id', in: 'path', required: true, schema: new OA\Schema(type: 'integer')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Cancelled'),
            new OA\Response(response: 400, description: 'Cannot cancel'),
            new OA\Response(response: 404, description: 'Not found'),
        ]
    )]
    public function destroy(Request $request, int $id, AppointmentService $appointments)
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $appointment = Appointment::query()
            ->where('customer_id', $customer->id)
            ->where('id', $id)
            ->first();

        if (! $appointment) {
            return response()->json(['success' => false, 'message' => 'Không tìm thấy lịch hẹn'], 404);
        }

        $result = $appointments->cancelByCustomer($appointment, $customer);

        return response()->json([
            'success' => $result['success'],
            'message' => $result['message'] ?? null,
        ], $result['success'] ? 200 : 400);
    }
}
