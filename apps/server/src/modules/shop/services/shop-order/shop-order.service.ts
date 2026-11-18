import type { ShopOrder, YookassaNotification } from '@chatovo/schemas';

import { formatRubAmount, resolveShopProduct, shopProductKeySchema } from '@chatovo/schemas';
import { Injectable, Logger } from '@nestjs/common';
import { isNullish } from 'remeda';

import type { ShopOrder as ShopOrderRow } from '../../../../../generated';
import type {
  AssertNotOwnedInput,
  CreateShopOrderInput,
  GetShopOrderInput
} from '../shop.service.types';

import {
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { parseEquippedCosmetics } from '../../../users';
import { PENDING_ORDER_SWEEP, REFUND_EVENT_PREFIX, YOOKASSA_CURRENCY } from '../../config';
import { YookassaService } from '../yookassa';

@Injectable()
export class ShopOrderService {
  private readonly logger = new Logger(ShopOrderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly yookassa: YookassaService
  ) {}

  private toShopOrder(order: ShopOrderRow): ShopOrder {
    return {
      id: order.id,
      productKey: shopProductKeySchema.parse(order.productKey),
      status: order.status,
      confirmationUrl: order.status === 'pending' ? order.confirmationUrl : null
    };
  }

  private async assertNotOwned({ userId, items }: AssertNotOwnedInput): Promise<void> {
    const owned = await this.prisma.entitlement.count({
      where: { userId, productKey: { in: items } }
    });

    if (owned > 0) {
      throw new AppConflictException('COSMETIC_ALREADY_OWNED', 'Already owned');
    }
  }

  private async syncOrder(order: ShopOrderRow): Promise<ShopOrderRow> {
    if (order.status !== 'pending' || isNullish(order.paymentId) || !this.yookassa.isEnabled()) {
      return order;
    }

    const payment = await this.yookassa.getPayment(order.paymentId);

    if (payment.status === 'pending') {
      return order;
    }

    if (payment.status === 'canceled') {
      return this.prisma.shopOrder.update({
        where: { id: order.id },
        data: { status: 'canceled' }
      });
    }

    const isPaidInFull =
      payment.amountValue === formatRubAmount(order.amountRub) &&
      payment.currency === YOOKASSA_CURRENCY;

    if (!isPaidInFull) {
      this.logger.error(`Payment ${payment.id} does not match order ${order.id}`);

      return order;
    }

    const { items } = resolveShopProduct(shopProductKeySchema.parse(order.productKey));

    const [fulfilled, granted] = await this.prisma.$transaction([
      this.prisma.shopOrder.update({
        where: { id: order.id },
        data: { status: 'succeeded' }
      }),
      this.prisma.entitlement.createMany({
        data: items.map((productKey) => ({ userId: order.userId, productKey, orderId: order.id })),
        skipDuplicates: true
      })
    ]);

    if (granted.count < items.length) {
      this.logger.error(
        `Order ${order.id} was paid for ${items.length - granted.count} item(s) the user already owned; refund payment ${payment.id}`
      );
    }

    return fulfilled;
  }

  async createOrder({ userId, productKey }: CreateShopOrderInput): Promise<ShopOrder> {
    if (!this.yookassa.isEnabled()) {
      throw new AppForbiddenException('SHOP_DISABLED', 'Shop is disabled');
    }

    const { items, priceRub } = resolveShopProduct(productKey);

    const reusable = await this.prisma.shopOrder.findFirst({
      where: {
        userId,
        productKey,
        status: 'pending',
        confirmationUrl: { not: null },
        createdAt: { gte: new Date(Date.now() - PENDING_ORDER_SWEEP.maxAgeMs) }
      },
      orderBy: { createdAt: 'desc' }
    });

    if (reusable) {
      return this.toShopOrder(await this.syncOrder(reusable));
    }

    const [, user] = await Promise.all([
      this.assertNotOwned({ userId, items }),
      this.prisma.user.findUniqueOrThrow({ where: { id: userId }, select: { email: true } })
    ]);

    const order = await this.prisma.shopOrder.create({
      data: { userId, productKey, amountRub: priceRub }
    });

    const payment = await this.yookassa
      .createPayment({
        orderId: order.id,
        productKey,
        amountRub: priceRub,
        customerEmail: user.email
      })
      .catch(async (error: unknown) => {
        await this.prisma.shopOrder.update({
          where: { id: order.id },
          data: { status: 'canceled' }
        });

        throw error;
      });

    const saved = await this.prisma.shopOrder.update({
      where: { id: order.id },
      data: { paymentId: payment.id, confirmationUrl: payment.confirmationUrl }
    });

    return this.toShopOrder(saved);
  }

  async getOrder({ userId, orderId }: GetShopOrderInput): Promise<ShopOrder> {
    const order = await this.prisma.shopOrder.findFirst({ where: { id: orderId, userId } });

    if (isNullish(order)) {
      throw new AppNotFoundException('SHOP_ORDER_NOT_FOUND', 'Order not found');
    }

    return this.toShopOrder(await this.syncOrder(order));
  }

  async syncPendingOrders(): Promise<void> {
    if (!this.yookassa.isEnabled()) {
      return;
    }

    const now = Date.now();
    const pending = await this.prisma.shopOrder.findMany({
      where: {
        status: 'pending',
        paymentId: { not: null },
        createdAt: {
          lte: new Date(now - PENDING_ORDER_SWEEP.minAgeMs),
          gte: new Date(now - PENDING_ORDER_SWEEP.maxAgeMs)
        }
      },
      orderBy: { createdAt: 'asc' },
      take: PENDING_ORDER_SWEEP.batchSize
    });

    const results = await Promise.allSettled(pending.map((order) => this.syncOrder(order)));
    const failed = results.filter(({ status }) => status === 'rejected').length;

    if (failed > 0) {
      this.logger.warn(`Pending order sweep: ${failed} of ${pending.length} could not be synced`);
    }
  }

  private async refund(refundId: string): Promise<void> {
    const refund = await this.yookassa.getRefund(refundId);

    if (!refund.succeeded) {
      return;
    }

    const order = await this.prisma.shopOrder.findUnique({
      where: { paymentId: refund.paymentId }
    });

    if (isNullish(order) || order.status === 'refunded') {
      return;
    }

    const { items } = resolveShopProduct(shopProductKeySchema.parse(order.productKey));
    const profile = await this.prisma.profile.findUnique({
      where: { userId: order.userId },
      select: { cosmetics: true }
    });
    const equipped = parseEquippedCosmetics(profile?.cosmetics);
    const cosmetics = Object.fromEntries(
      Object.entries(equipped).map(([kind, key]) => [kind, key && items.includes(key) ? null : key])
    );

    await this.prisma.$transaction([
      this.prisma.entitlement.deleteMany({ where: { orderId: order.id } }),
      this.prisma.shopOrder.update({ where: { id: order.id }, data: { status: 'refunded' } }),
      this.prisma.profile.updateMany({ where: { userId: order.userId }, data: { cosmetics } })
    ]);

    this.logger.log(`Order ${order.id} refunded; ${items.length} item(s) taken back`);
  }

  async handleNotification({ event, object }: YookassaNotification): Promise<void> {
    if (event.startsWith(REFUND_EVENT_PREFIX)) {
      await this.refund(object.id);

      return;
    }

    const order = await this.prisma.shopOrder.findUnique({ where: { paymentId: object.id } });

    if (isNullish(order)) {
      this.logger.warn(`Notification for unknown payment ${object.id}`);

      return;
    }

    await this.syncOrder(order);
  }
}
