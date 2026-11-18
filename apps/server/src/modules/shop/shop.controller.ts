import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateShopOrderDto,
  EquipCosmeticDto,
  ShopOrderDto,
  ShopOrderIdParamDto,
  ShopStateDto,
  WebhookResultDto,
  YookassaNotificationDto
} from './dto/shop.dto';
import { YookassaIpGuard } from './guards';
import { CosmeticsService, ShopOrderService } from './services';

@ApiTags('shop')
@Controller('shop')
export class ShopController {
  constructor(
    private readonly cosmetics: CosmeticsService,
    private readonly orders: ShopOrderService
  ) {}

  @Get()
  @ZodResponse({ type: ShopStateDto })
  getState(@CurrentUser() userId: string) {
    return this.cosmetics.getState(userId);
  }

  @Post('equip')
  @HttpCode(200)
  @ZodResponse({ type: ShopStateDto })
  equip(@Body() body: EquipCosmeticDto, @CurrentUser() userId: string) {
    return this.cosmetics.equip({ userId, input: body });
  }

  @Post('orders')
  @Throttle({ default: { ttl: 60_000, limit: 10 } })
  @ZodResponse({ type: ShopOrderDto })
  createOrder(@Body() body: CreateShopOrderDto, @CurrentUser() userId: string) {
    return this.orders.createOrder({ userId, productKey: body.productKey });
  }

  @Get('orders/:id')
  @ZodResponse({ type: ShopOrderDto })
  getOrder(@Param() params: ShopOrderIdParamDto, @CurrentUser() userId: string) {
    return this.orders.getOrder({ userId, orderId: params.id });
  }

  @Post('webhook')
  @HttpCode(200)
  @AllowAnonymous()
  @SkipThrottle()
  @UseGuards(YookassaIpGuard)
  @ZodResponse({ type: WebhookResultDto })
  async handleWebhook(@Body() body: YookassaNotificationDto) {
    await this.orders.handleNotification(body);

    return { ok: true };
  }
}
