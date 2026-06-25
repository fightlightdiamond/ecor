<?php

namespace App\Services\Storefront;

use App\Models\Coupon;
use Illuminate\Support\Carbon;

class CouponService
{
    /**
     * @return array{valid: bool, message?: string, code?: string, type?: string, value?: float, discount?: float}
     */
    public function validate(string $code, float $cartTotal): array
    {
        $coupon = Coupon::query()
            ->whereRaw('UPPER(code) = ?', [strtoupper(trim($code))])
            ->where('is_active', true)
            ->first();

        if (!$coupon) {
            return ['valid' => false, 'message' => 'Mã giảm giá không hợp lệ'];
        }

        $now = Carbon::now();

        if ($coupon->starts_at && $now->lt($coupon->starts_at)) {
            return ['valid' => false, 'message' => 'Mã giảm giá chưa có hiệu lực'];
        }

        if ($coupon->expires_at && $now->gt($coupon->expires_at)) {
            return ['valid' => false, 'message' => 'Mã giảm giá đã hết hạn'];
        }

        if ($cartTotal <= 0) {
            return ['valid' => false, 'message' => 'Giỏ hàng trống'];
        }

        $discount = $this->calculateDiscount($coupon, $cartTotal);

        return [
            'valid' => true,
            'code' => $coupon->code,
            'type' => $coupon->type,
            'value' => (float) $coupon->value,
            'discount' => round($discount, 2),
        ];
    }

    public function calculateDiscount(Coupon $coupon, float $cartTotal): float
    {
        $discount = match ($coupon->type) {
            'percent', 'percentage' => $cartTotal * ((float) $coupon->value / 100),
            default => (float) $coupon->value,
        };

        return min($discount, $cartTotal);
    }
}
