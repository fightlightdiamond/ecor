import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class BookingAvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /** Khớp BookingAvailabilityService::slotsForDate (slot 30 phút). */
  async slotsForDate(date: string): Promise<Array<{ time: string; available: boolean }>> {
    const day = new Date(`${date}T00:00:00`);
    const next = new Date(day.getTime() + 24 * 3600_000);
    const dow = day.getDay(); // 0 CN, 6 T7
    const isWeekend = dow === 0 || dow === 6;
    const startHour = isWeekend ? 8 : 9;
    const endHour = isWeekend ? 22 : 21;

    const [inquiries, appts] = await Promise.all([
      this.prisma.contactInquiry.findMany({
        where: { type: 'booking', preferredAt: { gte: day, lt: next } },
        select: { preferredAt: true },
      }),
      this.prisma.appointment.findMany({
        where: { scheduledAt: { gte: day, lt: next }, status: { not: 'cancelled' } },
        select: { scheduledAt: true },
      }),
    ]);

    const booked = new Set<string>();
    for (const r of inquiries) if (r.preferredAt) booked.add(this.hhmm(r.preferredAt));
    for (const r of appts) if (r.scheduledAt) booked.add(this.hhmm(r.scheduledAt));

    const slots: Array<{ time: string; available: boolean }> = [];
    for (let hour = startHour; hour < endHour; hour++) {
      for (const minute of ['00', '30']) {
        const time = `${String(hour).padStart(2, '0')}:${minute}`;
        slots.push({ time, available: !booked.has(time) });
      }
    }
    return slots;
  }

  private hhmm(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
