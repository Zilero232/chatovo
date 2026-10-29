-- DM call log: a call row in a DM chat is a message of kind 'call' with its outcome in `call`,
-- written only by the server. Push devices remember the app locale for localized call pushes.
-- Additive only: existing messages become kind 'text'.

-- CreateEnum
CREATE TYPE "MessageKind" AS ENUM ('text', 'call');

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "call" JSONB,
ADD COLUMN     "kind" "MessageKind" NOT NULL DEFAULT 'text';

-- AlterTable
ALTER TABLE "push_device" ADD COLUMN     "locale" TEXT;
