import type { ParticipantMetadata, TokenResponse } from '@chatovo/schemas';

import { USER_ROLE } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { AccessToken } from 'livekit-server-sdk';
import { isNullish } from 'remeda';

import type {
  BuildAccessTokenInput,
  IssueTokenInput,
  LoadAccessibleRoomInput
} from '../../livekit.types';

import {
  AppForbiddenException,
  AppInternalException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import { MIC_LOCKED_PUBLISH_SOURCES, TOKEN_TTL_SECONDS } from '../../../../config/livekit';
import { PrismaService } from '../../../../core';
import {
  assertDmWithoutUserBlock,
  assertNotBlocked,
  assertNotRoomBanned,
  canAccessRoom
} from '../../../../lib';
import { toUserProfile } from '../../../users';
import { assertRoomAccess, resolveInvisible } from '../../lib';
import { isMicLocked } from '../../mic-lock-store';
import { grantRoomAccess } from '../../room-grant-store';

@Injectable()
export class LivekitService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService
  ) {}

  async issueRoomToken({
    roomId,
    password,
    userId,
    invisible
  }: IssueTokenInput): Promise<TokenResponse> {
    await assertNotBlocked(userId);

    const user = await this.loadUserOrThrow(userId);

    const isAdmin = user.role === USER_ROLE.admin;
    const isInvisible = resolveInvisible({ requested: invisible, isAdmin });

    const room = await this.loadAccessibleRoomOrThrow({ roomId, userId });

    await assertDmWithoutUserBlock({ roomId: room.id, userId });

    if (!isAdmin) {
      await assertNotRoomBanned({ roomId: room.id, userId });
    }

    if (!isInvisible) {
      await assertRoomAccess({ room, userId, password });
    }

    grantRoomAccess(room.id, userId);

    const token = await this.buildAccessToken({ user, roomId: room.id, isAdmin, isInvisible });

    return { token };
  }

  private async loadUserOrThrow(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (isNullish(user)) {
      throw new AppInternalException('INTERNAL_ERROR', 'User lookup failed');
    }

    return user;
  }

  private async loadAccessibleRoomOrThrow({ roomId, userId }: LoadAccessibleRoomInput) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId } });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    if (!canAccessRoom({ room, userId, tier: 'view' })) {
      throw new AppForbiddenException('FORBIDDEN', 'Forbidden');
    }

    return room;
  }

  private async buildAccessToken({ user, roomId, isAdmin, isInvisible }: BuildAccessTokenInput) {
    const { name, verified, developer, profileUrl, avatarUrl, bannerColor } = toUserProfile(user);
    const isMicLockedByModerator = !isInvisible && isMicLocked({ roomId, userId: user.id });

    const participantMetadata = {
      verified,
      developer,
      profileUrl,
      avatarUrl,
      bannerColor,
      invisible: isInvisible
    } satisfies ParticipantMetadata & { invisible: boolean };

    const at = new AccessToken(
      this.config.get('LIVEKIT_API_KEY'),
      this.config.get('LIVEKIT_API_SECRET'),
      {
        identity: user.id,
        name,
        metadata: JSON.stringify(participantMetadata),
        ttl: TOKEN_TTL_SECONDS
      }
    );

    at.addGrant({
      room: roomId,
      roomJoin: true,
      canPublish: !isInvisible,
      ...(isMicLockedByModerator ? { canPublishSources: MIC_LOCKED_PUBLISH_SOURCES } : {}),
      canSubscribe: true,
      canPublishData: !isInvisible,
      canUpdateOwnMetadata: true,
      roomAdmin: isAdmin,
      hidden: isInvisible
    });

    return at.toJwt();
  }
}
