import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { CartService } from './cart.service';
import { CouponService } from './coupon.service';
import { AddToCartDto, RemoveCartDto, UpdateCartDto, ValidateCouponDto } from './dto/cart.dto';

// throttle:30,1 của Laravel = 30 request / 60s
const RATE = { default: { limit: 30, ttl: 60_000 } };

@ApiTags('Storefront / Cart')
@ApiHeader({ name: 'X-Session-ID', required: true, description: 'Mã phiên giỏ hàng' })
@Controller('storefront')
export class CartController {
  constructor(
    private readonly cart: CartService,
    private readonly coupons: CouponService,
  ) {}

  @Public()
  @Get('cart')
  @ApiOperation({ summary: 'Giỏ hàng theo phiên' })
  getCart(@Headers('x-session-id') sessionId: string, @Lang() lang: string) {
    return this.cart.getCartData(sessionId ?? '', lang);
  }

  @Public()
  @Throttle(RATE)
  @Post('cart/add')
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ' })
  addToCart(@Headers('x-session-id') sessionId: string, @Body() dto: AddToCartDto) {
    return this.cart.addToCart(sessionId ?? '', dto);
  }

  @Public()
  @Throttle(RATE)
  @Post('cart/update')
  @ApiOperation({ summary: 'Cập nhật số lượng dòng giỏ (quantity=0 để xoá)' })
  updateCart(@Body() dto: UpdateCartDto) {
    return this.cart.updateCart(dto);
  }

  @Public()
  @Throttle(RATE)
  @Post('cart/remove')
  @ApiOperation({ summary: 'Xoá dòng giỏ' })
  removeFromCart(@Body() dto: RemoveCartDto) {
    return this.cart.removeFromCart(dto);
  }

  @Public()
  @Throttle(RATE)
  @Post('coupons/validate')
  @ApiOperation({ summary: 'Kiểm tra mã giảm giá' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    const data = await this.coupons.validate(dto.code, dto.cart_total);
    return { success: true, data };
  }
}
