<?php

namespace App\Observers;

use App\Models\Order;
use App\Services\Storefront\OrderService;
use App\Services\Storefront\StorefrontNotifier;

class OrderObserver
{
    public function created(Order $order): void
    {
        app(StorefrontNotifier::class)->orderCreated($order);
    }

    public function updated(Order $order): void
    {
        if ($order->wasChanged('payment_status') && $order->payment_status === 'paid') {
            app(StorefrontNotifier::class)->orderPaid($order);
        }

        if ($order->wasChanged('status')) {
            $previous = (string) $order->getOriginal('status');

            if ($order->status === 'cancelled' && $previous !== 'cancelled') {
                app(OrderService::class)->restoreStock($order);
            }

            app(StorefrontNotifier::class)->orderStatusChanged($order, $previous);
        }
    }
}
