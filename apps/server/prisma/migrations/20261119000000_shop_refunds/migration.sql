-- A refund that went through takes the items back: orders gain a refunded status. The
-- pending-order sweeper filters on status and age, so it gets a matching index.

-- AlterEnum
ALTER TYPE "ShopOrderStatus" ADD VALUE 'refunded';

-- CreateIndex
CREATE INDEX "shop_orders_status_created_at_idx" ON "shop_orders"("status", "created_at");
