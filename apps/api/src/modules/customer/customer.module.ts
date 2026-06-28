import { Module } from '@nestjs/common';
import { BookingModule } from '../booking/booking.module';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

@Module({
  imports: [BookingModule], // dùng AppointmentService (link/cancel/format)
  controllers: [CustomerController],
  providers: [CustomerService],
})
export class CustomerModule {}
