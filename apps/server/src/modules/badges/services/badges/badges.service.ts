import type { BadgeProgressList, EarnedBadgeList } from '@chatovo/schemas';

import { getBadgeTier } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { differenceInCalendarDays } from 'date-fns';

import { PrismaService } from '../../../../core';
import { getUserWithProfileOrThrow } from '../../../../lib';

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  async getProgress(userId: string): Promise<BadgeProgressList> {
    const [user, purchases, friends, messages, rooms, collection] = await Promise.all([
      getUserWithProfileOrThrow(userId),
      this.prisma.shopOrder.count({ where: { userId, status: 'succeeded' } }),
      this.prisma.friendship.count({
        where: { status: 'accepted', OR: [{ requesterId: userId }, { addresseeId: userId }] }
      }),
      this.prisma.message.count({ where: { senderId: userId, kind: 'text', deletedAt: null } }),
      this.prisma.room.count({ where: { ownerId: userId, kind: 'group' } }),
      this.prisma.entitlement.count({ where: { userId } })
    ]);

    const values = {
      supporter: purchases,
      veteran: differenceInCalendarDays(new Date(), user.createdAt),
      social: friends,
      chatter: messages,
      host: rooms,
      collector: collection
    };

    return Object.entries(values).map(([id, value]) => {
      const badgeId = id as keyof typeof values;

      return { id: badgeId, value, tier: getBadgeTier({ id: badgeId, value }) };
    });
  }

  async getEarned(userId: string): Promise<EarnedBadgeList> {
    const progress = await this.getProgress(userId);

    return progress.filter(({ tier }) => tier > 0).map(({ id, tier }) => ({ id, tier }));
  }
}
