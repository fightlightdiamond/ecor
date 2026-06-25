<?php

namespace App\Services\Storefront;

use App\Models\Order;
use App\Support\StorefrontCache;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function restoreStock(Order $order): bool
    {
        $meta = $order->payment_meta ?? [];

        if (! empty($meta['stock_restored'])) {
            return false;
        }

        $order->loadMissing('items.product');

        DB::transaction(function () use ($order, &$meta) {
            foreach ($order->items as $item) {
                if ($item->product) {
                    $item->product->increment('stock', $item->qty);
                }
            }

            $meta['stock_restored'] = true;
            $meta['stock_restored_at'] = now()->toIso8601String();
            $order->update(['payment_meta' => $meta]);
        });

        StorefrontCache::flush();

        return true;
    }

    public function cancelUnpaidVnpayOrder(Order $order, string $reason = 'Payment expired'): bool
    {
        if ($order->payment_method !== 'vnpay' || $order->payment_status === 'paid') {
            return false;
        }

        if (in_array($order->status, ['cancelled', 'delivered', 'shipped'], true)) {
            return false;
        }

        $meta = $order->payment_meta ?? [];
        $meta['cancel_reason'] = $reason;
        $meta['cancelled_at'] = now()->toIso8601String();

        $order->update([
            'status' => 'cancelled',
            'payment_status' => $order->payment_status === 'pending' ? 'failed' : $order->payment_status,
            'payment_meta' => $meta,
        ]);

        $this->restoreStock($order);

        return true;
    }

    /**
     * @return int Number of orders cancelled
     */
    public function expireUnpaidVnpayOrders(): int
    {
        $minutes = (int) config('payment.vnpay.expiry_minutes', 15);
        $cutoff = now()->subMinutes($minutes);

        $orders = Order::query()
            ->where('payment_method', 'vnpay')
            ->where('payment_status', 'pending')
            ->where('status', 'new')
            ->where('created_at', '<', $cutoff)
            ->get();

        $count = 0;

        foreach ($orders as $order) {
            if ($this->cancelUnpaidVnpayOrder($order, 'VNPay payment window expired')) {
                $count++;
            }
        }

        return $count;
    }
}
