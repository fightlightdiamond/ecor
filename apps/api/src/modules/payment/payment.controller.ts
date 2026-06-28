import { Controller, Get, Logger, Post, Query, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { VnpayService } from './vnpay.service';
import { getFrontendUrl } from '../../config/payment.config';

@ApiTags('Payment / VNPay')
@Controller('payments/vnpay')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly vnpay: VnpayService) {}

  /** GET /api/payments/vnpay/return — VNPay redirect khách về, ta redirect tới FE. */
  @Public()
  @Get('return')
  @ApiOperation({ summary: 'VNPay return URL' })
  async vnpayReturn(@Query() query: Record<string, any>, @Res() res: Response) {
    const fe = getFrontendUrl().replace(/\/+$/, '');
    try {
      const result = await this.vnpay.verifyReturn(query);
      const orderNumber = encodeURIComponent(result.order?.number ?? '');
      const status = result.success ? 'success' : 'failed';
      return res.redirect(`${fe}/thanh-toan/ket-qua?status=${status}&order=${orderNumber}`);
    } catch (e) {
      this.logger.error(`vnpayReturn error: ${(e as Error).message}`);
      return res.redirect(`${fe}/thanh-toan/ket-qua?status=failed&order=`);
    }
  }

  /** POST /api/payments/vnpay/ipn — VNPay gọi server-to-server, trả text RspCode. */
  @Public()
  @Post('ipn')
  @ApiOperation({ summary: 'VNPay IPN (server-to-server)' })
  async vnpayIpn(@Req() req: Request, @Res() res: Response) {
    try {
      const input = { ...(req.query as Record<string, any>), ...(req.body as Record<string, any>) };
      const result = await this.vnpay.handleIpn(input);
      return res.type('text/plain').send(`RspCode=${result.RspCode}&Message=${result.Message}`);
    } catch (e) {
      this.logger.error(`vnpayIpn error: ${(e as Error).message}`);
      return res.type('text/plain').send('RspCode=99&Message=Unknown error');
    }
  }
}
