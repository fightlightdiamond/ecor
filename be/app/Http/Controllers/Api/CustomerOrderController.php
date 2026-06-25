<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Order;
use App\Support\OrderPresenter;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class CustomerOrderController extends Controller
{
    #[OA\Get(
        path: '/api/customer/orders',
        operationId: 'customerOrders',
        summary: 'List my orders',
        tags: ['Customer'],
        security: [['customerBearer' => []]],
        responses: [new OA\Response(response: 200, description: 'Order list')]
    )]
    public function index(Request $request)
    {
        /** @var Customer $customer */
        $customer = $request->user();

        $orders = Order::query()
            ->where('customer_id', $customer->id)
            ->with(['items.product'])
            ->latest()
            ->get()
            ->map(fn (Order $order) => $this->formatOrder($order));

        return response()->json([
            'success' => true,
            'data' => $orders,
        ]);
    }

    private function formatOrder(Order $order): array
    {
        return OrderPresenter::forStorefront($order);
    }
}
