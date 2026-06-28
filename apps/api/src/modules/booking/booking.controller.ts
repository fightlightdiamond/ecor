import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { BookingService } from './booking.service';
import { AvailabilityDto, SubmitBookingDto, SubmitContactDto } from './dto/booking.dto';

const RATE20 = { default: { limit: 20, ttl: 60_000 } };

@ApiTags('Storefront / Booking')
@Controller('storefront')
export class BookingController {
  constructor(private readonly booking: BookingService) {}

  @Public()
  @Get('booking/availability')
  @ApiOperation({ summary: 'Khung giờ đặt lịch còn trống' })
  availability(@Query() dto: AvailabilityDto) {
    return this.booking.getAvailability(dto);
  }

  @Public()
  @Throttle(RATE20)
  @Post('booking')
  @ApiOperation({ summary: 'Gửi yêu cầu đặt lịch' })
  submitBooking(@Body() dto: SubmitBookingDto) {
    return this.booking.submitBooking(dto);
  }

  @Public()
  @Throttle(RATE20)
  @Post('contact')
  @ApiOperation({ summary: 'Gửi form liên hệ' })
  submitContact(@Body() dto: SubmitContactDto) {
    return this.booking.submitContact(dto);
  }
}
