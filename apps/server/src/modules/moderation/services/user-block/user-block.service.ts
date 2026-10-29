import { canActOnRole } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isNullish } from 'remeda';

import type { UserBlockedEvent } from '../../../../common/events/domain-events';
import type { BlockUserInput, UnblockUserInput } from '../../moderation.service.types';

import { DomainEvent } from '../../../../common/events/domain-events';
import {
  AppBadRequestException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { revokeUserSessions } from '../../../auth';
import { ejectParticipantEverywhere, revokeUserGrants } from '../../../livekit';
import { BLOCKED_WS_CLOSE_CODE, closeUserConnections } from '../../../realtime';
import { ADMIN_LIST_MAX } from '../../config';
import { adminUserInclude, toAdminUser } from '../../mappers';

@Injectable()
export class UserBlockService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2
  ) {}

  async block({ userId, adminId, input }: BlockUserInput) {
    if (userId === adminId) {
      throw new AppBadRequestException('BLOCK_SELF', 'Cannot block yourself');
    }

    const [actor, user] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: adminId }, select: { role: true } }),
      this.prisma.user.findUnique({ where: { id: userId } })
    ]);

    if (isNullish(user)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    if (!canActOnRole({ actorRole: actor?.role, targetRole: user.role })) {
      throw new AppForbiddenException('ROLE_PROTECTED', 'Cannot block an equal or higher role');
    }

    const blocked = await this.prisma.user.update({
      where: { id: userId },
      data: {
        banned: true,
        banReason: input.reason,
        bannedAt: new Date(),
        bannedById: adminId
      },
      include: adminUserInclude
    });

    await this.evict(userId);

    this.events.emit(DomainEvent.UserBlocked, {
      userId,
      userName: user.name,
      email: user.email,
      reason: input.reason,
      blockedBy: adminId
    } satisfies UserBlockedEvent);

    return toAdminUser(blocked);
  }

  async unblock({ userId }: UnblockUserInput) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (isNullish(user)) {
      throw new AppNotFoundException('USER_NOT_FOUND', 'User not found');
    }

    const unblocked = await this.prisma.user.update({
      where: { id: userId },
      data: {
        banned: false,
        banReason: null,
        banExpires: null,
        bannedAt: null,
        bannedById: null
      },
      include: adminUserInclude
    });

    return toAdminUser(unblocked);
  }

  async list() {
    const users = await this.prisma.user.findMany({
      where: { banned: true },
      include: adminUserInclude,
      orderBy: { bannedAt: 'desc' },
      take: ADMIN_LIST_MAX
    });

    return users.map(toAdminUser);
  }

  private async evict(userId: string) {
    revokeUserGrants(userId);
    closeUserConnections(userId, BLOCKED_WS_CLOSE_CODE, 'Account blocked');

    await Promise.allSettled([revokeUserSessions(userId), ejectParticipantEverywhere(userId)]);
  }
}
