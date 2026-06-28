import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { VnpayService } from './vnpay.service';

/**
 * Thay command `orders:expire-unpaid-vnpay` (Laravel scheduler, mỗi 5 phút).
 * Bọc try/catch: lỗi cron KHÔNG làm sập ứng dụng / luồng khác.
 */
@Injectable()
export class PaymentExpiryTask {
  private readonly logger = new Logger(PaymentExpiryTask.name);

  constructor(private readonly vnpay: VnpayService) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handle(): Promise<void> {
    try {
      const count = await this.vnpay.expireUnpaidVnpayOrders();
      if (count > 0) {
        this.logger.log(`Đã huỷ ${count} đơn VNPay quá hạn chưa thanh toán.`);
      }
    } catch (e) {
      this.logger.error(`expireUnpaidVnpayOrders failed: ${(e as Error).message}`);
    }
  }
}
