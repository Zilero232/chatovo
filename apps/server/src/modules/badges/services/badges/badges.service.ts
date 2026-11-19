import type { BadgeProgressList, EarnedBadgeList } from '@chatovo/schemas';

import { getBadgeTier } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { differenceInCalendarDays } from 'date-fns';

import type { CallActivityRow, MessageActivityRow } from '../../lib';

import { PrismaService } from '../../../../core';
import { getUserWithProfileOrThrow } from '../../../../lib';
import { ATTACHMENT_BODY_PATTERN } from '../../config';
import { countFilledProfileFields, toActivityStats } from '../../lib';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgress(userId: string): Promise<BadgeProgressList> {
    const [user, purchases, friends, messages, rooms, collection, activity] = await Promise.all([
      getUserWithProfileOrThrow(userId),
      this.prisma.shopOrder.count({ where: { userId, status: 'succeeded' } }),
      this.prisma.friendship.count({
        where: { status: 'accepted', OR: [{ requesterId: userId }, { addresseeId: userId }] }
      }),
      this.prisma.message.count({ where: { senderId: userId, kind: 'text', deletedAt: null } }),
      this.prisma.room.count({ where: { ownerId: userId, kind: 'group' } }),
      this.prisma.entitlement.count({ where: { userId } }),
      this.getActivity(userId)
    ]);

    const values = {
      supporter: purchases,
      veteran: differenceInCalendarDays(new Date(), user.createdAt),
      social: friends,
      chatter: messages,
      host: rooms,
      collector: collection,
      ...activity,
      stylist: countFilledProfileFields(user.profile)
    };

    return Object.entries(values).map(([id, value]) => {
      const badgeId = id as keyof typeof values;

      return { id: badgeId, value, tier: getBadgeTier({ id: badgeId, value }) };
    });
  }

  private async getActivity(userId: string) {
    const [[messages], [calls]] = await Promise.all([
      this.prisma.$queryRaw<MessageActivityRow[]>`
        SELECT
          COUNT(DISTINCT m.room_id) FILTER (WHERE r.kind = 'dm') AS "dmChats",
          COUNT(DISTINCT m.room_id) FILTER (WHERE r.kind = 'group') AS "groupRooms",
          COUNT(*) FILTER (WHERE m.body LIKE ${ATTACHMENT_BODY_PATTERN}) AS "attachments",
          COUNT(DISTINCT (m.created_at AT TIME ZONE 'UTC')::date) AS "activeDays"
        FROM messages m
        JOIN rooms r ON r.id = m.room_id
        WHERE m.sender_id = ${userId} AND m.kind = 'text' AND m.deleted_at IS NULL
      `,
      this.prisma.$queryRaw<CallActivityRow[]>`
        SELECT COALESCE(SUM((m.call ->> 'durationSec')::int), 0) AS "seconds"
        FROM messages m
        JOIN rooms r ON r.id = m.room_id
        WHERE m.kind = 'call'
          AND r.kind = 'dm'
          AND (r.dm_user_a_id = ${userId} OR r.dm_user_b_id = ${userId})
          AND m.call ->> 'outcome' = 'completed'
          AND m.call ->> 'durationSec' IS NOT NULL
      `
    ]);

    return toActivityStats({ messages, calls });
  }

  async getEarned(userId: string): Promise<EarnedBadgeList> {
    const progress = await this.getProgress(userId);

    return progress.filter(({ tier }) => tier > 0).map(({ id, tier }) => ({ id, tier }));
  }
}
