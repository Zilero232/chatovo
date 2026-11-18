-- Paid cosmetics: orders paid through YooKassa (one item or a whole set), the items a user
-- owns, and the equipped slots on the profile as one JSON object. Additive only.

-- CreateEnum
CREATE TYPE "ShopOrderStatus" AS ENUM ('pending', 'succeeded', 'canceled');

-- AlterTable
ALTER TABLE "profile" ADD COLUMN     "cosmetics" JSONB;

-- CreateTable
CREATE TABLE "shop_orders" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "user_id" TEXT NOT NULL,
    "product_key" TEXT NOT NULL,
    "amount_rub" INTEGER NOT NULL,
    "status" "ShopOrderStatus" NOT NULL DEFAULT 'pending',
    "payment_id" TEXT,
    "confirmation_url" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shop_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entitlements" (
    "user_id" TEXT NOT NULL,
    "product_key" TEXT NOT NULL,
    "order_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entitlements_pkey" PRIMARY KEY ("user_id","product_key")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_orders_payment_id_key" ON "shop_orders"("payment_id");

-- CreateIndex
CREATE INDEX "shop_orders_user_id_idx" ON "shop_orders"("user_id");

-- CreateIndex
CREATE INDEX "entitlements_order_id_idx" ON "entitlements"("order_id");

-- AddForeignKey
ALTER TABLE "shop_orders" ADD CONSTRAINT "shop_orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entitlements" ADD CONSTRAINT "entitlements_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "shop_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
