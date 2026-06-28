import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotifierService } from '../notifier/notifier.service';
import { AppointmentService } from './appointment.service';
import { BookingAvailabilityService } from './booking-availability.service';
import { AvailabilityDto, SubmitBookingDto, SubmitContactDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly appointments: AppointmentService,
    private readonly availability: BookingAvailabilityService,
    private readonly notifier: NotifierService,
  ) {}

  /** GET /storefront/booking/availability */
  async getAvailability(dto: AvailabilityDto) {
    return {
      success: true,
      data: { date: dto.date, slots: await this.availability.slotsForDate(dto.date) },
    };
  }

  /** POST /storefront/booking */
  async submitBooking(dto: SubmitBookingDto) {
    const appointment = await this.appointments.createFromBooking(dto);

    const now = new Date();
    const preferredAt =
      dto.preferred_date
        ? new Date(`${dto.preferred_date}T${dto.preferred_time && /^\d{1,2}:\d{2}$/.test(dto.preferred_time) ? dto.preferred_time : '09:00'}:00`)
        : null;

    await this.prisma.contactInquiry.create({
      data: {
        type: 'booking',
        name: dto.name,
        phone: dto.phone,
        email: dto.email ?? null,
        service: dto.service ?? null,
        message: dto.note ?? null,
        source: 'booking-form',
        preferredAt: preferredAt && !isNaN(preferredAt.getTime()) ? preferredAt : null,
        metadata: {
          appointment_id: appointment.id,
          ...(dto.staff_id ? { staff_id: dto.staff_id } : {}),
          ...(dto.preferred_time ? { preferred_time: dto.preferred_time } : {}),
        },
        createdAt: now,
        updatedAt: now,
      },
    });

    return {
      success: true,
      message: 'Đặt lịch thành công! Chúng tôi sẽ xác nhận với bạn sớm.',
      data: { appointment_id: appointment.id },
    };
  }

  /** POST /storefront/contact */
  async submitContact(dto: SubmitContactDto) {
    const now = new Date();
    const inquiry = await this.prisma.contactInquiry.create({
      data: {
        type: 'contact',
        name: dto.name,
        phone: dto.phone,
        email: dto.email ?? null,
        service: dto.service ?? null,
        message: dto.message ?? null,
        source: dto.source ?? 'website',
        createdAt: now,
        updatedAt: now,
      },
    });
    await this.notifier.contactReceived(inquiry);
    return { success: true, message: 'Cảm ơn! Chúng tôi sẽ liên hệ với bạn sớm.' };
  }
}
