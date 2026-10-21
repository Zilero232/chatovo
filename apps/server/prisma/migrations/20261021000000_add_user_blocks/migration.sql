-- User-to-user blocking (Google Play UGC policy), separate from the moderator ban on "user".
-- Additive only: one new table, nothing existing is touched.

-- CreateTable
CREATE TABLE "user_block" (
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_block_pkey" PRIMARY KEY ("blockerId","blockedId")
);

-- CreateIndex
CREATE INDEX "user_block_blockedId_idx" ON "user_block"("blockedId");

-- AddForeignKey
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_block" ADD CONSTRAINT "user_block_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
