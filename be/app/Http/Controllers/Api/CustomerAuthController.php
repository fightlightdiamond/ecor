<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Services\Storefront\AppointmentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use OpenApi\Attributes as OA;

class CustomerAuthController extends Controller
{
    #[OA\Post(
        path: '/api/customer/register',
        operationId: 'customerRegister',
        summary: 'Register customer account',
        tags: ['Customer'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['name', 'phone', 'password'],
                properties: [
                    new OA\Property(property: 'name', type: 'string'),
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'email', type: 'string', nullable: true),
                    new OA\Property(property: 'password', type: 'string', format: 'password', minLength: 6),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 201, description: 'Registered'),
            new OA\Response(response: 422, description: 'Validation error'),
        ]
    )]
    public function register(Request $request, AppointmentService $appointments)
    {
        $request->merge([
            'phone' => Customer::normalizePhone($request->input('phone', '')),
        ]);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:50|unique:customers,phone',
            'email' => 'nullable|email|max:255',
            'password' => 'required|string|min:6|max:255',
        ]);

        $phone = Customer::normalizePhone($data['phone']);

        $customer = Customer::create([
            'name' => $data['name'],
            'phone' => $phone,
            'email' => $data['email'] ?? null,
            'password' => $data['password'],
        ]);

        $appointments->linkAppointmentsToCustomer($customer);
        $appointments->linkOrdersToCustomer($customer);

        $token = $customer->createToken('customer', ['customer:access'])->plainTextToken;

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'customer' => $this->formatCustomer($customer),
            ],
        ], 201);
    }

    #[OA\Post(
        path: '/api/customer/login',
        operationId: 'customerLogin',
        summary: 'Customer login',
        tags: ['Customer'],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\JsonContent(
                required: ['phone', 'password'],
                properties: [
                    new OA\Property(property: 'phone', type: 'string'),
                    new OA\Property(property: 'password', type: 'string', format: 'password'),
                ]
            )
        ),
        responses: [
            new OA\Response(response: 200, description: 'Authenticated'),
            new OA\Response(response: 401, description: 'Invalid credentials'),
        ]
    )]
    public function login(Request $request)
    {
        $request->merge([
            'phone' => Customer::normalizePhone($request->input('phone', '')),
        ]);

        $data = $request->validate([
            'phone' => 'required|string',
            'password' => 'required|string',
        ]);

        $phone = Customer::normalizePhone($data['phone']);
        $customer = Customer::query()->where('phone', $phone)->first();

        if (! $customer || ! Hash::check($data['password'], $customer->password)) {
            throw ValidationException::withMessages([
                'phone' => ['Thông tin đăng nhập không chính xác.'],
            ]);
        }

        $token = $customer->createToken('customer', ['customer:access'])->plainTextToken;

        app(AppointmentService::class)->linkAppointmentsToCustomer($customer);
        app(AppointmentService::class)->linkOrdersToCustomer($customer);

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $token,
                'customer' => $this->formatCustomer($customer),
            ],
        ]);
    }

    #[OA\Post(
        path: '/api/customer/logout',
        operationId: 'customerLogout',
        summary: 'Revoke customer token',
        tags: ['Customer'],
        security: [['customerBearer' => []]],
        responses: [new OA\Response(response: 200, description: 'Logged out')]
    )]
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json(['success' => true, 'message' => 'Đã đăng xuất']);
    }

    #[OA\Get(
        path: '/api/customer/profile',
        operationId: 'customerProfile',
        summary: 'Customer profile',
        tags: ['Customer'],
        security: [['customerBearer' => []]],
        responses: [new OA\Response(response: 200, description: 'Profile')]
    )]
    public function profile(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $this->formatCustomer($request->user()),
        ]);
    }

    private function formatCustomer(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'phone' => $customer->phone,
            'email' => $customer->email,
        ];
    }
}
