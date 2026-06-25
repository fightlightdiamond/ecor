<?php

namespace App\Http\Controllers\Api\Concerns;

use App\Models\ContactInquiry;
use App\Models\Product;
use App\Models\Review;
use App\Services\Storefront\AppointmentService;
use App\Services\Storefront\BookingAvailabilityService;
use App\Services\Storefront\CouponService;
use App\Services\Payment\VNPayService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

trait ManagesStorefrontExtras
{
    #[OA\Post(
        path: '/api/storefront/coupons/validate',
        operationId: 'validateCoupon',
        summary: 'Validate coupon code',
        description: 'Check whether a coupon is valid and compute discount for the current cart total.',
        tags: ['Coupons'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['code', 'cart_total'],
                properties: [
                    new OA\Property(property: 'code', type: 'string', example: 'SUMMER10'),
                    new OA\Property(property: 'cart_total', type: 'number', format: 'float', example: 500000),
                ]
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: 'Validation result',
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: 'success', type: 'boolean'),
                        new OA\Property(property: 'data', properties: [
                            new OA\Property(property: 'valid', type: 'boolean'),
                            new OA\Property(property: 'code', type: 'string', nullable: true),
                            new OA\Property(property: 'type', type: 'string', nullable: true),
                            new OA\Property(property: 'value', type: 'number', nullable: true),
                            new OA\Property(property: 'discount', type: 'number', nullable: true),
                            new OA\Property(property: 'message', type: 'string', nullable: true),
                        ], type: 'object'),
                    ]
                )
            ),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function validateCoupon(Request $request, CouponService $coupons): JsonResponse
    {
        $data = $request->validate([
            'code' => 'required|string|max:50',
            'cart_total' => 'required|numeric|min:0',
        ]);

        $result = $coupons->validate($data['code'], (float) $data['cart_total']);

        return response()->json([
            'success' => true,
            'data' => $result,
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/products/{slug}/reviews',
        operationId: 'getProductReviews',
        summary: 'List approved product reviews',
        tags: ['Products', 'Reviews'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
            new OA\Parameter(name: 'slug', in: 'path', required: true, schema: new OA\Schema(type: 'string')),
            new OA\Parameter(name: 'per_page', in: 'query', required: false, schema: new OA\Schema(type: 'integer', default: 10, maximum: 50)),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Review list'),
            new OA\Response(response: 404, description: 'Product not found', content: new OA\JsonContent(ref: '#/components/schemas/ApiErrorEnvelope')),
        ]
    )]
    public function getProductReviews(Request $request, string $slug): JsonResponse
    {
        $product = Product::query()
            ->where('slug', $slug)
            ->where('status', 'published')
            ->first();

        if (!$product) {
            return response()->json(['success' => false, 'message' => 'Not found'], 404);
        }

        $perPage = min((int) $request->input('per_page', 10), 50);
        $reviews = Review::query()
            ->where('product_id', $product->id)
            ->where('is_approved', true)
            ->with('user:id,name')
            ->latest()
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => collect($reviews->items())->map(fn (Review $review) => [
                'id' => $review->id,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'author' => $review->user?->name ?? 'Khách hàng',
                'created_at' => $review->created_at,
            ]),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'total' => $reviews->total(),
                'per_page' => $reviews->perPage(),
                'average_rating' => round((float) Review::query()
                    ->where('product_id', $product->id)
                    ->where('is_approved', true)
                    ->avg('rating'), 1),
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/storefront/booking',
        operationId: 'submitBooking',
        summary: 'Submit salon/spa booking request',
        description: 'Creates a booking inquiry for salon services. Stored in admin under Contact Inquiries.',
        tags: ['Booking'],
        parameters: [
            new OA\Parameter(ref: '#/components/parameters/LangQuery'),
        ],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'phone'],
                properties: [
                    new OA\Property(property: 'name', type: 'string', example: 'Nguyễn Văn A'),
                    new OA\Property(property: 'phone', type: 'string', example: '0901234567'),
                    new OA\Property(property: 'email', type: 'string', format: 'email', nullable: true),
                    new OA\Property(property: 'service', type: 'string', nullable: true, description: 'Service slug or name'),
                    new OA\Property(property: 'staff_id', type: 'integer', nullable: true),
                    new OA\Property(property: 'preferred_date', type: 'string', format: 'date', nullable: true, example: '2026-07-01'),
                    new OA\Property(property: 'preferred_time', type: 'string', nullable: true, example: '10:00'),
                    new OA\Property(property: 'note', type: 'string', nullable: true),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Booking submitted'),
            new OA\Response(response: 422, description: 'Validation error'),
            new OA\Response(response: 429, description: 'Too many requests'),
        ]
    )]
    public function submitBooking(Request $request, AppointmentService $appointmentService): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'service' => 'nullable|string|max:255',
            'staff_id' => 'nullable|integer',
            'preferred_date' => 'nullable|date|after_or_equal:today',
            'preferred_time' => 'nullable|string|max:20',
            'note' => 'nullable|string|max:5000',
        ]);

        $preferredAt = null;
        if (!empty($data['preferred_date'])) {
            $time = $data['preferred_time'] ?? '09:00';
            $preferredAt = \Illuminate\Support\Carbon::parse("{$data['preferred_date']} {$time}");
        }

        $appointment = $appointmentService->createFromBooking($data);

        ContactInquiry::create([
            'type' => 'booking',
            'name' => $data['name'],
            'phone' => $data['phone'],
            'email' => $data['email'] ?? null,
            'service' => $data['service'] ?? null,
            'message' => $data['note'] ?? null,
            'source' => 'booking-form',
            'preferred_at' => $preferredAt,
            'metadata' => array_filter([
                'appointment_id' => $appointment->id,
                'staff_id' => $data['staff_id'] ?? null,
                'preferred_time' => $data['preferred_time'] ?? null,
            ]),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Đặt lịch thành công! Chúng tôi sẽ xác nhận với bạn sớm.',
            'data' => [
                'appointment_id' => $appointment->id,
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/booking/availability',
        operationId: 'getBookingAvailability',
        summary: 'Available booking time slots',
        description: 'Returns 30-minute slots for a given date based on salon hours and existing bookings.',
        tags: ['Booking'],
        parameters: [
            new OA\Parameter(name: 'date', in: 'query', required: true, schema: new OA\Schema(type: 'string', format: 'date', example: '2026-07-01')),
        ],
        responses: [
            new OA\Response(response: 200, description: 'Slot list'),
            new OA\Response(response: 422, description: 'Invalid date'),
        ]
    )]
    public function getBookingAvailability(Request $request, BookingAvailabilityService $availability): JsonResponse
    {
        $data = $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        return response()->json([
            'success' => true,
            'data' => [
                'date' => $data['date'],
                'slots' => $availability->slotsForDate($data['date']),
            ],
        ]);
    }

    #[OA\Get(
        path: '/api/storefront/payment-methods',
        operationId: 'getPaymentMethods',
        summary: 'Available checkout payment methods',
        tags: ['Orders'],
        responses: [new OA\Response(response: 200, description: 'Method list')]
    )]
    public function getPaymentMethods(VNPayService $vnpay): JsonResponse
    {
        $methods = [
            ['id' => 'cod', 'label' => 'Thanh toán khi nhận hàng (COD)'],
        ];

        if ($vnpay->isConfigured()) {
            $methods[] = ['id' => 'vnpay', 'label' => 'VNPay (ATM / QR / Thẻ)'];
        }

        return response()->json([
            'success' => true,
            'data' => ['methods' => $methods],
        ]);
    }
}
