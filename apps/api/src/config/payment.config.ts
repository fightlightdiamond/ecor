import { registerAs } from '@nestjs/config';

export interface VnpayConfig {
  enabled: boolean;
  tmnCode: string;
  hashSecret: string;
  url: string;
  returnUrl: string;
  ipnUrl: string;
  expiryMinutes: number;
}

/** Đọc config VNPay từ env tại thời điểm gọi (không throw lúc boot). */
export function getVnpayConfig(): VnpayConfig {
  return {
    enabled: process.env.VNPAY_ENABLED === 'true',
    tmnCode: process.env.VNPAY_TMN_CODE || '',
    hashSecret: process.env.VNPAY_HASH_SECRET || '',
    url: process.env.VNPAY_URL || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html',
    returnUrl: process.env.VNPAY_RETURN_URL || '',
    ipnUrl: process.env.VNPAY_IPN_URL || '',
    expiryMinutes: parseInt(process.env.VNPAY_EXPIRY_MINUTES || '15', 10),
  };
}

export function getFrontendUrl(): string {
  return process.env.STOREFRONT_FRONTEND_URL || process.env.CORS_ORIGIN || 'http://localhost:3000';
}

export function isVnpayConfigured(): boolean {
  const c = getVnpayConfig();
  return Boolean(c.enabled && c.tmnCode && c.hashSecret && c.returnUrl && c.ipnUrl);
}

/** Khớp config('payment.vnpay') của Laravel (giữ cho ConfigModule nếu cần). */
export default registerAs('payment', () => ({
  frontendUrl: getFrontendUrl(),
  vnpay: getVnpayConfig(),
}));
