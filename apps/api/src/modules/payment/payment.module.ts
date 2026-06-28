import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { VnpayService } from './vnpay.service';
import { PaymentExpiryTask } from './payment-expiry.task';

/**
 * Module thanh toán tự cô lập: VNPay + cron huỷ đơn quá hạn.
 * Lỗi trong module này được bắt nội bộ (service + controller + cron đều
 * try/catch) nên không lan sang catalog/cart/order/COD.
 */
@Module({
  controllers: [PaymentController],
  providers: [VnpayService, PaymentExpiryTask],
  exports: [VnpayService],
})
export class PaymentModule {}
