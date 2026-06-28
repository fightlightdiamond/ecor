import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomInt } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { CouponService } from '../cart/coupon.service';
import { VnpayService } from '../payment/vnpay.service';
import { NotifierService } from '../notifier/notifier.service';
import { isVnpayConfigured } from '../../config/payment.config';
import { presentOrder } from './order.presenter';
import { CheckoutDto, LookupOrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly coupons: CouponService,
    private readonly vnpay: VnpayService,
    private readonly notifier: NotifierService,
  ) {}

  /** POST /storefront/checkout — khớp StorefrontController::checkout. */
  async checkout(sessionId: string, dto: CheckoutDto, ipAddress = '127.0.0.1') {
    const paymentMethod = dto.payment_method ?? 'cod';

    if (paymentMethod === 'vnpay' && !isVnpayConfigured()) {
      throw new BadRequestException('Thanh toán VNPay chưa được cấu hình');
    }

    const cart = await this.prisma.cart.findFirst({ where: { sessionId } });
    const items = cart
      ? await this.prisma.cartItem.findMany({
          where: { cartId: cart.id },
          include: { product: true },
        })
      : [];

    if (items.length === 0) {
      throw new BadRequestException('Giỏ hàng trống');
    }

    const subtotal = items.reduce(
      (sum, item) => sum + item.quantity * Number(item.product?.price ?? 0),
      0,
    );

    let discount = 0;
    let couponCode: string | null = null;
    if (dto.coupon_code) {
      const result = await this.coupons.validate(dto.coupon_code, subtotal);
      if (!result.valid) {
        throw new BadRequestException(result.message ?? 'Mã giảm giá không hợp lệ');
      }
      discount = result.discount ?? 0;
      couponCode = result.code ?? null;
    }

    const totalPrice = Math.max(0, subtotal - discount);
    const now = new Date();
    const number = this.generateOrderNumber(now);

    const order = await this.prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          // userId/customerId: gắn ở Phase 7 (Customer auth).
          number,
          customerName: dto.name,
          customerEmail: dto.email ?? null,
          customerPhone: dto.phone,
          shippingAddress: dto.address,
          totalPrice,
          status: 'new',
          paymentMethod,
          paymentStatus: 'pending',
          shippingFee: 0,
          notes: couponCode ? `Coupon: ${couponCode} (-${discount})` : null,
          createdAt: now,
          updatedAt: now,
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: created.id,
            productId: item.productId,
            qty: item.quantity,
            price: item.product?.price ?? 0,
            createdAt: now,
            updatedAt: now,
          },
        });
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart!.id } });
      return created;
    });

    await this.notifier.orderCreated(order); // best-effort (tự nuốt lỗi)

    const payload: Record<string, unknown> = {
      order_number: order.number,
      subtotal,
      discount,
      total_price: totalPrice,
      payment_method: paymentMethod,
    };
    if (paymentMethod === 'vnpay') {
      // Đơn đã tạo xong. Nếu tạo link VNPay lỗi, KHÔNG mất đơn — trả về để
      // khách có thể retry-payment sau (cô lập lỗi payment).
      try {
        payload.payment_url = this.vnpay.createPaymentUrl(order, ipAddress);
      } catch (e) {
        this.logger.error(`createPaymentUrl failed cho đơn ${order.number}: ${(e as Error).message}`);
        payload.payment_url = null;
        payload.payment_error = 'Không tạo được liên kết thanh toán, vui lòng thử lại.';
      }
    }

    return {
      success: true,
      message: paymentMethod === 'vnpay' ? 'Chuyển đến cổng thanh toán VNPay...' : 'Đặt hàng thành công!',
      data: payload,
    };
  }

  /** GET /storefront/orders/lookup */
  async lookup(dto: LookupOrderDto) {
    const order = await this.findByNumberAndPhone(dto.number, dto.phone);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return { success: true, data: presentOrder(order) };
  }

  /** POST /storefront/orders/retry-payment */
  async retryPayment(dto: LookupOrderDto, ipAddress = '127.0.0.1') {
    if (!isVnpayConfigured()) {
      throw new BadRequestException('Thanh toán VNPay chưa được cấu hình');
    }
    const order = await this.findByNumberAndPhone(dto.number, dto.phone);
    if (!order) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    const presented = presentOrder(order);
    if (!presented.can_retry_payment) {
      throw new BadRequestException('Đơn hàng không thể thanh toán lại');
    }
    return {
      success: true,
      data: { payment_url: this.vnpay.createPaymentUrl(order, ipAddress) },
    };
  }

  private async findByNumberAndPhone(number: string, phone: string) {
    const stripped = phone.replace(/\s+/g, '');
    return this.prisma.order.findFirst({
      where: {
        number,
        OR: [{ customerPhone: phone }, { customerPhone: stripped }],
      },
      include: { items: { include: { product: true } } },
    });
  }

  /** ORD-YYYYMMDD-XXXXXX (6 ký tự A-Z0-9), khớp Laravel. */
  private generateOrderNumber(date: Date): string {
    const ymd =
      `${date.getFullYear()}` +
      `${date.getMonth() + 1}`.padStart(2, '0') +
      `${date.getDate()}`.padStart(2, '0');
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rand = '';
    for (let i = 0; i < 6; i++) rand += chars[randomInt(chars.length)];
    return `ORD-${ymd}-${rand}`;
  }
}
