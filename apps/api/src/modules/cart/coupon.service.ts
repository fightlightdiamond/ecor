import { Injectable } from '@nestjs/common';
import { Coupon } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';

export interface CouponValidationResult {
  valid: boolean;
  message?: string;
  code?: string;
  type?: string;
  value?: number;
  discount?: number;
}

/** Khớp App\Services\Storefront\CouponService. */
@Injectable()
export class CouponService {
  constructor(private readonly prisma: PrismaService) {}

  async validate(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const coupon = await this.prisma.coupon.findFirst({
      where: { code: { equals: code.trim(), mode: 'insensitive' }, isActive: true },
    });

    if (!coupon) {
      return { valid: false, message: 'Mã giảm giá không hợp lệ' };
    }

    const now = new Date();
    if (coupon.startsAt && now < coupon.startsAt) {
      return { valid: false, message: 'Mã giảm giá chưa có hiệu lực' };
    }
    if (coupon.expiresAt && now > coupon.expiresAt) {
      return { valid: false, message: 'Mã giảm giá đã hết hạn' };
    }
    if (cartTotal <= 0) {
      return { valid: false, message: 'Giỏ hàng trống' };
    }

    const discount = this.calculateDiscount(coupon, cartTotal);
    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discount: Math.round(discount * 100) / 100,
    };
  }

  calculateDiscount(coupon: Coupon, cartTotal: number): number {
    const value = Number(coupon.value);
    const discount =
      coupon.type === 'percent' || coupon.type === 'percentage'
        ? cartTotal * (value / 100)
        : value;
    return Math.min(discount, cartTotal);
  }
}
