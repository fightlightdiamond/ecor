import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Appointment, ContactInquiry, Order } from '@prisma/client';

/**
 * Thay App\Services\Storefront\StorefrontNotifier (phần mail).
 * Gửi mail BEST-EFFORT: mọi lỗi được nuốt + log, KHÔNG làm hỏng luồng nghiệp vụ
 * (đặt lịch / liên hệ / đặt hàng vẫn thành công kể cả khi SMTP lỗi).
 * Thông báo trong-admin (Filament) được thay bằng AdminJS ở Phase 10.
 */
@Injectable()
export class NotifierService {
  private readonly logger = new Logger(NotifierService.name);
  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST || 'localhost',
    port: parseInt(process.env.MAIL_PORT || '1025', 10),
    secure: false,
  });
  private readonly from = process.env.MAIL_FROM || 'noreply@thanglongcheviet.vn';
  private readonly adminEmail = process.env.STOREFRONT_ADMIN_EMAIL || 'admin@thanglongcheviet.vn';
  private readonly siteName = process.env.STOREFRONT_SITE_NAME || 'Thăng Long Chè Việt';

  private async send(to: string | null | undefined, subject: string, lines: string[]): Promise<void> {
    if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return;
    try {
      await this.transporter.sendMail({ from: this.from, to, subject, text: lines.join('\n') });
    } catch (e) {
      this.logger.warn(`Mail failed (${to}): ${(e as Error).message}`);
    }
  }

  async bookingCreated(appointment: Appointment): Promise<void> {
    const when = appointment.scheduledAt
      ? appointment.scheduledAt.toISOString()
      : 'Chưa chọn giờ';
    await this.send(appointment.customerEmail, `Đã nhận yêu cầu đặt lịch — ${this.siteName}`, [
      `Chào ${appointment.customerName},`,
      'Chúng tôi đã nhận yêu cầu đặt lịch của bạn và sẽ xác nhận sớm.',
      `Dịch vụ: ${appointment.service ?? '—'}`,
      `Thời gian mong muốn: ${when}`,
    ]);
    await this.send(this.adminEmail, `Lịch hẹn mới — ${this.siteName}`, [
      `Khách: ${appointment.customerName}`,
      `SĐT: ${appointment.customerPhone}`,
      `Email: ${appointment.customerEmail ?? '—'}`,
      `Dịch vụ: ${appointment.service ?? '—'}`,
      `Thời gian: ${when}`,
      `Ghi chú: ${appointment.notes ?? '—'}`,
    ]);
  }

  async contactReceived(inquiry: ContactInquiry): Promise<void> {
    await this.send(this.adminEmail, `Liên hệ mới — ${this.siteName}`, [
      `Tên: ${inquiry.name}`,
      `SĐT: ${inquiry.phone}`,
      `Email: ${inquiry.email ?? '—'}`,
      `Dịch vụ: ${inquiry.service ?? '—'}`,
      `Nội dung: ${inquiry.message ?? '—'}`,
      `Nguồn: ${inquiry.source ?? 'website'}`,
    ]);
  }

  async orderCreated(order: Order): Promise<void> {
    const total = Number(order.totalPrice).toLocaleString('vi-VN');
    await this.send(this.adminEmail, `Đơn hàng mới — ${order.number}`, [
      `Mã đơn: ${order.number}`,
      `Khách: ${order.customerName}`,
      `SĐT: ${order.customerPhone}`,
      `Email: ${order.customerEmail ?? '—'}`,
      `Địa chỉ: ${order.shippingAddress}`,
      `Tổng: ${total}đ`,
    ]);
    if (order.paymentMethod !== 'vnpay') {
      await this.send(order.customerEmail, `Xác nhận đơn hàng ${order.number} — ${this.siteName}`, [
        `Cảm ơn ${order.customerName} đã đặt hàng!`,
        `Mã đơn: ${order.number}`,
        `Tổng: ${total}đ`,
      ]);
    }
  }
}
