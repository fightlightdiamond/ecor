import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CustomerService } from './customer.service';
import { LoginDto, RegisterDto } from './dto/customer.dto';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customers: CustomerService) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Đăng ký tài khoản khách' })
  register(@Body() dto: RegisterDto) {
    return this.customers.register(dto);
  }

  @Public()
  @Throttle({ default: { limit: 20, ttl: 60_000 } })
  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng nhập khách' })
  login(@Body() dto: LoginDto) {
    return this.customers.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('logout')
  @HttpCode(200)
  @ApiOperation({ summary: 'Đăng xuất' })
  logout() {
    return this.customers.logout();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  @ApiOperation({ summary: 'Hồ sơ khách' })
  profile(@CurrentUser('sub') sub: number) {
    return this.customers.profile(Number(sub));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('orders')
  @ApiOperation({ summary: 'Đơn hàng của tôi' })
  orders(@CurrentUser('sub') sub: number) {
    return this.customers.listOrders(Number(sub));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('appointments')
  @ApiOperation({ summary: 'Lịch hẹn của tôi' })
  appointments(@CurrentUser('sub') sub: number) {
    return this.customers.listAppointments(Number(sub));
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('appointments/:id')
  @ApiOperation({ summary: 'Hủy lịch hẹn (trước 24h)' })
  cancel(@CurrentUser('sub') sub: number, @Param('id', ParseIntPipe) id: number) {
    return this.customers.cancelAppointment(Number(sub), id);
  }
}
