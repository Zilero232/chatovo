-- The DEV badge becomes its own flag instead of a side effect of the admin role,
-- so a moderator or a plain user can carry it and an admin can go without.
-- Every current admin keeps the badge they already show.

-- AlterTable
ALTER TABLE "user" ADD COLUMN "developer" BOOLEAN NOT NULL DEFAULT false;

UPDATE "user" SET "developer" = true WHERE "role" = 'admin';
