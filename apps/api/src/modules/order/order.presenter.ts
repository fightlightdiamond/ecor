import { Order, OrderItem, Product } from '@prisma/client';

type OrderWithItems = Order & {
  items: (OrderItem & { product: Product | null })[];
};

const EXPIRY_MINUTES = parseInt(process.env.VNPAY_EXPIRY_MINUTES || '15', 10);

/**
 * Khớp App\Support\OrderPresenter::forStorefront.
 * total_price / price là chuỗi decimal (Eloquent decimal column → string).
 */
export function presentOrder(order: OrderWithItems): Record<string, unknown> {
  const canRetryPayment =
    order.paymentMethod === 'vnpay' &&
    order.paymentStatus === 'pending' &&
    order.status !== 'cancelled' &&
    !!order.createdAt &&
    order.createdAt.getTime() > Date.now() - EXPIRY_MINUTES * 60_000;

  return {
    number: order.number,
    status: order.status,
    payment_status: order.paymentStatus,
    payment_method: order.paymentMethod,
    can_retry_payment: canRetryPayment,
    total_price: order.totalPrice.toFixed(2),
    customer_name: order.customerName,
    shipping_address: order.shippingAddress,
    created_at: order.createdAt,
    items: order.items.map((item) => ({
      product_name: item.product?.name ?? null,
      quantity: item.qty,
      price: item.price.toFixed(2),
    })),
  };
}
