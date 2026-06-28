import { Injectable } from '@nestjs/common';
import { Appointment } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { NotifierService } from '../notifier/notifier.service';

export const APPT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export interface BookingData {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  staff_id?: number;
  preferred_date?: string;
  preferred_time?: string;
  note?: string;
}

@Injectable()
export class AppointmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifier: NotifierService,
  ) {}

  static normalizePhone(phone: string): string {
    return (phone ?? '').replace(/\s+/g, '');
  }

  /** Khớp AppointmentService::createFromBooking. */
  async createFromBooking(data: BookingData): Promise<Appointment> {
    const phone = AppointmentService.normalizePhone(data.phone);
    const scheduledAt = this.parsePreferred(data.preferred_date, data.preferred_time);
    const customer = await this.prisma.customer.findFirst({ where: { phone } });
    const now = new Date();

    const appointment = await this.prisma.appointment.create({
      data: {
        customerId: customer?.id ?? null,
        customerName: data.name,
        customerPhone: phone,
        customerEmail: data.email ?? null,
        service: data.service ?? null,
        staffId: data.staff_id ?? null,
        scheduledAt,
        status: APPT_STATUS.PENDING,
        notes: data.note ?? null,
        metadata: data.preferred_time ? { preferred_time: data.preferred_time } : {},
        createdAt: now,
        updatedAt: now,
      },
    });

    await this.recordStatus(appointment, APPT_STATUS.PENDING, null, 'Booking submitted via website');
    await this.notifier.bookingCreated(appointment);
    return appointment;
  }

  async recordStatus(appointment: Appointment, status: string, changedBy: number | null, notes: string | null) {
    const now = new Date();
    await this.prisma.appointment.update({
      where: { id: appointment.id },
      data: { status, updatedAt: now },
    });
    await this.prisma.appointmentStatusHistory.create({
      data: { appointmentId: appointment.id, status, changedBy, notes, createdAt: now, updatedAt: now },
    });
  }

  /** Gắn lịch hẹn/đơn mồ côi vào khách khi đăng ký/đăng nhập. */
  async linkToCustomer(customerId: number, phone: string): Promise<void> {
    await this.prisma.appointment.updateMany({
      where: { customerId: null, customerPhone: phone },
      data: { customerId },
    });
    await this.prisma.order.updateMany({
      where: { customerId: null, customerPhone: phone },
      data: { customerId },
    });
  }

  async cancelByCustomer(appointment: Appointment, customerId: number): Promise<{ success: boolean; message: string }> {
    if (appointment.customerId !== customerId) {
      return { success: false, message: 'Không tìm thấy lịch hẹn' };
    }
    if (([APPT_STATUS.CANCELLED, APPT_STATUS.COMPLETED] as string[]).includes(appointment.status)) {
      return { success: false, message: 'Lịch hẹn không thể hủy' };
    }
    if (appointment.scheduledAt && appointment.scheduledAt.getTime() <= Date.now() + 24 * 3600_000) {
      return { success: false, message: 'Chỉ hủy được trước 24 giờ so với giờ hẹn' };
    }
    await this.recordStatus(appointment, APPT_STATUS.CANCELLED, null, 'Cancelled by customer');
    return { success: true, message: 'Đã hủy lịch hẹn' };
  }

  formatForApi(a: Appointment) {
    return {
      id: a.id,
      service: a.service,
      status: a.status,
      scheduled_at: a.scheduledAt,
      notes: a.notes,
      created_at: a.createdAt,
    };
  }

  private parsePreferred(date?: string, time?: string): Date | null {
    if (!date) return null;
    const t = time && /^\d{1,2}:\d{2}$/.test(time) ? time : '09:00';
    const parsed = new Date(`${date}T${t}:00`);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
}
