import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { AppointmentService } from './appointment.service';
import { BookingAvailabilityService } from './booking-availability.service';

@Module({
  controllers: [BookingController],
  providers: [BookingService, AppointmentService, BookingAvailabilityService],
  exports: [AppointmentService],
})
export class BookingModule {}
