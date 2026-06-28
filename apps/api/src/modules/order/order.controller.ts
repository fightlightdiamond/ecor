import { Body, Controller, Get, Headers, Ip, Post, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { OrderService } from './order.service';
import { CheckoutDto, LookupOrderDto } from './dto/order.dto';

// throttle:10,1 của Laravel = 10 request / 60s
const RATE = { default: { limit: 10, ttl: 60_000 } };

@ApiTags('Storefront / Orders')
@Controller('storefront')
export class OrderController {
  constructor(private readonly orders: OrderService) {}

  @Public()
  @Throttle(RATE)
  @Post('checkout')
  @ApiOperation({ summary: 'Đặt hàng từ giỏ (COD / VNPay)' })
  checkout(@Headers('x-session-id') sessionId: string, @Body() dto: CheckoutDto, @Ip() ip: string) {
    return this.orders.checkout(sessionId ?? '', dto, ip);
  }

  @Public()
  @Get('orders/lookup')
  @ApiOperation({ summary: 'Tra cứu đơn theo mã + số điện thoại' })
  lookup(@Query() dto: LookupOrderDto) {
    return this.orders.lookup(dto);
  }

  @Public()
  @Throttle(RATE)
  @Post('orders/retry-payment')
  @ApiOperation({ summary: 'Lấy lại link thanh toán VNPay cho đơn pending' })
  retry(@Body() dto: LookupOrderDto, @Ip() ip: string) {
    return this.orders.retryPayment(dto, ip);
  }
}
