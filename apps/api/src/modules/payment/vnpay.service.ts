import { Injectable, Logger } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';
import { Order } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { getVnpayConfig, isVnpayConfigured } from '../../config/payment.config';

export interface PaymentResult {
  success: boolean;
  order?: Order;
  message: string;
  response_code?: string;
}

/**
 * Port App\Services\Payment\VNPayService.
 * Chữ ký HMAC-SHA512 trên dữ liệu đã urlencode KIỂU PHP (space→'+') để
 * tương thích tuyệt đối với VNPay và backend Laravel cũ.
 *
 * Toàn bộ phương thức công khai bọc try/catch → lỗi VNPay KHÔNG ném ra ngoài
 * làm sập request/luồng khác.
 */
@Injectable()
export class VnpayService {
  private readonly logger = new Logger(VnpayService.name);

  constructor(private readonly prisma: PrismaService) {}

  isConfigured(): boolean {
    return isVnpayConfigured();
  }

  /** Tạo URL thanh toán. Ném lỗi nếu chưa cấu hình (caller tự xử lý). */
  createPaymentUrl(order: Order, ipAddress: string): string {
    const cfg = getVnpayConfig();
    const amount = Math.round(Number(order.totalPrice) * 100);

    const params: Record<string, string> = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: cfg.tmnCode,
      vnp_Amount: String(amount),
      vnp_CurrCode: 'VND',
      vnp_TxnRef: String(order.id),
      vnp_OrderInfo: `Thanh toan don hang ${order.number}`,
      vnp_OrderType: 'other',
      vnp_Locale: 'vn',
      vnp_ReturnUrl: cfg.returnUrl,
      vnp_IpAddr: ipAddress,
      vnp_CreateDate: this.formatDate(new Date()),
      vnp_ExpireDate: this.formatDate(new Date(Date.now() + cfg.expiryMinutes * 60_000)),
    };

    params.vnp_SecureHash = this.hash(params);
    return `${cfg.url}?${this.buildQuery(params)}`;
  }

  async verifyReturn(input: Record<string, any>): Promise<PaymentResult> {
    try {
      if (!this.isValidSignature(input)) {
        return { success: false, message: 'Invalid signature' };
      }
      return await this.resolvePayment(input);
    } catch (e) {
      this.logger.error(`verifyReturn error: ${(e as Error).message}`);
      return { success: false, message: 'Internal error' };
    }
  }

  async handleIpn(input: Record<string, any>): Promise<{ RspCode: string; Message: string }> {
    try {
      if (!this.isValidSignature(input)) {
        return { RspCode: '97', Message: 'Invalid signature' };
      }
      const result = await this.resolvePayment(input);
      if (!result.success) {
        return { RspCode: result.response_code ?? '99', Message: result.message };
      }
      return { RspCode: '00', Message: 'Confirm Success' };
    } catch (e) {
      this.logger.error(`handleIpn error: ${(e as Error).message}`);
      return { RspCode: '99', Message: 'Unknown error' };
    }
  }

  // ── Order payment lifecycle (port OrderService) ──────────────────────────

  /** Hoàn kho khi huỷ đơn (idempotent qua payment_meta.stock_restored). */
  async restoreStock(order: Order): Promise<boolean> {
    const meta = (order.paymentMeta as Record<string, any> | null) ?? {};
    if (meta.stock_restored) return false;

    const items = await this.prisma.orderItem.findMany({ where: { orderId: order.id } });
    await this.prisma.$transaction(async (tx) => {
      for (const item of items) {
        if (item.productId) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.qty } },
          });
        }
      }
      await tx.order.update({
        where: { id: order.id },
        data: {
          paymentMeta: {
            ...meta,
            stock_restored: true,
            stock_restored_at: new Date().toISOString(),
          },
          updatedAt: new Date(),
        },
      });
    });
    return true;
  }

  async cancelUnpaidVnpayOrder(order: Order, reason = 'Payment expired'): Promise<boolean> {
    if (order.paymentMethod !== 'vnpay' || order.paymentStatus === 'paid') return false;
    if (['cancelled', 'delivered', 'shipped'].includes(order.status)) return false;

    const meta = (order.paymentMeta as Record<string, any> | null) ?? {};
    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        status: 'cancelled',
        paymentStatus: order.paymentStatus === 'pending' ? 'failed' : order.paymentStatus,
        paymentMeta: { ...meta, cancel_reason: reason, cancelled_at: new Date().toISOString() },
        updatedAt: new Date(),
      },
    });
    await this.restoreStock(updated);
    return true;
  }

  /** Huỷ các đơn VNPay quá hạn chưa thanh toán. Trả số đơn đã huỷ. */
  async expireUnpaidVnpayOrders(): Promise<number> {
    const cfg = getVnpayConfig();
    const cutoff = new Date(Date.now() - cfg.expiryMinutes * 60_000);
    const orders = await this.prisma.order.findMany({
      where: {
        paymentMethod: 'vnpay',
        paymentStatus: 'pending',
        status: 'new',
        createdAt: { lt: cutoff },
      },
    });

    let count = 0;
    for (const order of orders) {
      if (await this.cancelUnpaidVnpayOrder(order, 'VNPay payment window expired')) count++;
    }
    return count;
  }

  // ── internals ────────────────────────────────────────────────────────────

  private async resolvePayment(input: Record<string, any>): Promise<PaymentResult> {
    const txnRef = input.vnp_TxnRef;
    const responseCode = input.vnp_ResponseCode;
    const transactionNo = input.vnp_TransactionNo ?? null;

    if (!txnRef) return { success: false, message: 'Missing txn ref', response_code: '01' };

    const order = await this.prisma.order.findUnique({ where: { id: Number(txnRef) } });
    if (!order) return { success: false, message: 'Order not found', response_code: '01' };

    if (order.paymentStatus === 'paid') {
      return { success: true, order, message: 'Already confirmed' };
    }

    const meta = (order.paymentMeta as Record<string, any> | null) ?? {};

    if (responseCode !== '00') {
      const updated = await this.prisma.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: 'failed',
          paymentMeta: {
            ...meta,
            vnpay_response_code: responseCode,
            vnpay_transaction_no: transactionNo,
            failed_at: new Date().toISOString(),
          },
          updatedAt: new Date(),
        },
      });
      return { success: false, order: updated, message: 'Payment failed', response_code: responseCode ?? '99' };
    }

    const expectedAmount = Math.round(Number(order.totalPrice) * 100);
    const paidAmount = Number(input.vnp_Amount ?? 0);
    if (paidAmount !== expectedAmount) {
      return { success: false, message: 'Invalid amount', response_code: '04' };
    }

    const updated = await this.prisma.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: 'paid',
        paymentMethod: 'vnpay',
        status: order.status === 'new' ? 'processing' : order.status,
        paymentMeta: {
          ...meta,
          vnpay_transaction_no: transactionNo,
          vnpay_bank_code: input.vnp_BankCode ?? null,
          vnpay_pay_date: input.vnp_PayDate ?? null,
          paid_at: new Date().toISOString(),
        },
        updatedAt: new Date(),
      },
    });
    return { success: true, order: updated, message: 'Payment confirmed' };
  }

  private isValidSignature(input: Record<string, any>): boolean {
    const secureHash = (input.vnp_SecureHash as string) ?? '';
    const filtered: Record<string, string> = {};
    for (const [k, v] of Object.entries(input)) {
      if (k === 'vnp_SecureHash' || k === 'vnp_SecureHashType') continue;
      if (v === null || v === undefined || v === '') continue;
      filtered[k] = String(v);
    }
    const expected = this.hash(filtered);
    try {
      const a = Buffer.from(secureHash);
      const b = Buffer.from(expected);
      return a.length === b.length && timingSafeEqual(a, b);
    } catch {
      return false;
    }
  }

  /** ksort + 'key=urlencode(value)&...' rồi HMAC-SHA512. */
  private hash(params: Record<string, string>): string {
    const keys = Object.keys(params).sort();
    const hashData = keys
      .map((k) => `${this.phpUrlencode(k)}=${this.phpUrlencode(params[k])}`)
      .join('&');
    return createHmac('sha512', getVnpayConfig().hashSecret).update(hashData, 'utf8').digest('hex');
  }

  private buildQuery(params: Record<string, string>): string {
    return Object.entries(params)
      .map(([k, v]) => `${this.phpUrlencode(k)}=${this.phpUrlencode(v)}`)
      .join('&');
  }

  /** Khớp PHP urlencode (space→'+', encode !*'()~). */
  private phpUrlencode(str: string): string {
    return encodeURIComponent(str)
      .replace(/%20/g, '+')
      .replace(/!/g, '%21')
      .replace(/\*/g, '%2A')
      .replace(/'/g, '%27')
      .replace(/\(/g, '%28')
      .replace(/\)/g, '%29')
      .replace(/~/g, '%7E');
  }

  private formatDate(d: Date): string {
    const p = (n: number) => String(n).padStart(2, '0');
    return (
      `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}` +
      `${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
    );
  }
}
