import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Cart } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { MediaService } from '../media/media.service';
import { presentProduct } from '../catalog/product.presenter';
import { AddToCartDto, RemoveCartDto, UpdateCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly media: MediaService,
  ) {}

  /** Khớp StorefrontController::getCart (firstOrCreate theo session_id). */
  private async resolveCart(sessionId: string): Promise<Cart> {
    let cart = await this.prisma.cart.findFirst({ where: { sessionId } });
    if (!cart) {
      const now = new Date();
      cart = await this.prisma.cart.create({
        data: { sessionId, createdAt: now, updatedAt: now },
      });
    }
    // TODO(Phase 7 - Customer): gắn user_id khi có khách đăng nhập (JWT).
    return cart;
  }

  /** GET /storefront/cart */
  async getCartData(sessionId: string, locale: string) {
    const cart = await this.resolveCart(sessionId);
    const items = await this.prisma.cartItem.findMany({
      where: { cartId: cart.id },
      include: { product: true },
    });

    return {
      success: true,
      data: {
        cart: this.serializeCart(cart),
        items: await Promise.all(
          items.map(async (item) => ({
            id: item.id,
            product_id: item.productId,
            quantity: item.quantity,
            product: item.product
              ? presentProduct(
                  item.product,
                  locale,
                  await this.media.resolveImageUrls(item.product.images),
                )
              : null,
          })),
        ),
      },
    };
  }

  /** POST /storefront/cart/add */
  async addToCart(sessionId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.product_id, status: 'published' },
    });
    if (!product) {
      throw new NotFoundException('Sản phẩm không khả dụng');
    }

    const quantity = dto.quantity ?? 1;
    const cart = await this.resolveCart(sessionId);
    const item = await this.prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: dto.product_id },
    });
    const nextQty = (item?.quantity ?? 0) + quantity;

    if (nextQty > product.stock) {
      throw new BadRequestException('Số lượng vượt quá tồn kho');
    }

    const now = new Date();
    if (item) {
      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: nextQty, updatedAt: now },
      });
    } else {
      await this.prisma.cartItem.create({
        data: { cartId: cart.id, productId: dto.product_id, quantity, createdAt: now, updatedAt: now },
      });
    }

    return { success: true, message: 'Đã thêm vào giỏ hàng' };
  }

  /** POST /storefront/cart/update */
  async updateCart(dto: UpdateCartDto) {
    const item = await this.prisma.cartItem.findUnique({
      where: { id: dto.item_id },
      include: { product: true },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (dto.quantity > 0) {
      if (item.product && dto.quantity > item.product.stock) {
        throw new BadRequestException('Số lượng vượt quá tồn kho');
      }
      await this.prisma.cartItem.update({
        where: { id: item.id },
        data: { quantity: dto.quantity, updatedAt: new Date() },
      });
    } else {
      await this.prisma.cartItem.delete({ where: { id: item.id } });
    }

    return { success: true, message: 'Cập nhật thành công' };
  }

  /** POST /storefront/cart/remove */
  async removeFromCart(dto: RemoveCartDto) {
    await this.prisma.cartItem.deleteMany({ where: { id: dto.item_id } });
    return { success: true, message: 'Đã xóa' };
  }

  /** Giữ key snake_case như serialization Eloquent. */
  private serializeCart(cart: Cart) {
    return {
      id: cart.id,
      session_id: cart.sessionId,
      user_id: cart.userId,
      created_at: cart.createdAt,
      updated_at: cart.updatedAt,
    };
  }
}
