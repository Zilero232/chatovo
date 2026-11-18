import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

import { PENDING_ORDER_SWEEP } from '../../config';
import { ShopOrderService } from '../shop-order';

@Injectable()
export class OrderSweeperService {
  constructor(private readonly orders: ShopOrderService) {}

  @Interval(PENDING_ORDER_SWEEP.intervalMs)
  async settlePendingOrders(): Promise<void> {
    await this.orders.syncPendingOrders();
  }
}
