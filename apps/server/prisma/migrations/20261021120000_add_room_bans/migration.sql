-- Room-owner moderation: a ban keeps one user out of one room until the owner lifts it.
-- Additive only: one new table, nothing existing is touched.

-- CreateTable
CREATE TABLE "room_bans" (
    "room_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "banned_by_id" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "room_bans_pkey" PRIMARY KEY ("room_id","user_id")
);

-- CreateIndex
CREATE INDEX "room_bans_user_id_idx" ON "room_bans"("user_id");

-- AddForeignKey
ALTER TABLE "room_bans" ADD CONSTRAINT "room_bans_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_bans" ADD CONSTRAINT "room_bans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "room_bans" ADD CONSTRAINT "room_bans_banned_by_id_fkey" FOREIGN KEY ("banned_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

