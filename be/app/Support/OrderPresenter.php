<?php

namespace App\Support;

use App\Models\Order;
use App\Models\OrderItem;

class OrderPresenter
{
    public static function forStorefront(Order $order): array
    {
        $order->loadMissing('items.product');

        $expiryMinutes = (int) config('payment.vnpay.expiry_minutes', 15);
        $canRetryPayment = $order->payment_method === 'vnpay'
            && $order->payment_status === 'pending'
            && $order->status !== 'cancelled'
            && $order->created_at?->gt(now()->subMinutes($expiryMinutes));

        return [
            'number' => $order->number,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'can_retry_payment' => $canRetryPayment,
            'total_price' => $order->total_price,
            'customer_name' => $order->customer_name,
            'shipping_address' => $order->shipping_address,
            'created_at' => $order->created_at,
            'items' => $order->items->map(fn (OrderItem $item) => [
                'product_name' => $item->product?->name,
                'quantity' => $item->qty,
                'price' => $item->price,
            ])->values()->all(),
        ];
    }
}
