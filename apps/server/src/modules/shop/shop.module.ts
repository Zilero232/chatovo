import { Module } from '@nestjs/common';

import {
  CosmeticsService,
  OrderSweeperService,
  ShopOrderService,
  YookassaService
} from './services';
import { ShopController } from './shop.controller';

@Module({
  controllers: [ShopController],
  providers: [YookassaService, ShopOrderService, CosmeticsService, OrderSweeperService]
})
export class ShopModule {}
