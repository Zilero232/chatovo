import { Injectable } from '@nestjs/common';

import type { RoomStats, SignupStats } from '../notifications.service.types';

import { AbuseTarget, RoomKind } from '../../../../../generated';
import { PrismaService } from '../../../../core';
import { SIGNUP_WINDOW_MS } from '../../config';

@Injectable()
export class TelegramContextService {
  constructor(private readonly prisma: PrismaService) {}

  async getSignupStats(): Promise<SignupStats> {
    const since = new Date(Date.now() - SIGNUP_WINDOW_MS);

    const [totalUsers, signupsLastDay] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { createdAt: { gte: since } } })
    ]);

    return { totalUsers, signupsLastDay };
  }

  async getRoomStats(roomName: string): Promise<RoomStats> {
    const [room, totalRooms] = await Promise.all([
      this.prisma.room.findUnique({ where: { name: roomName }, select: { id: true } }),
      this.prisma.room.count({ where: { kind: RoomKind.group } })
    ]);

    return { roomId: room?.id ?? null, totalRooms };
  }

  countUserReports(userId: string): Promise<number> {
    return this.prisma.abuseReport.count({
      where: { target: AbuseTarget.user, targetId: userId }
    });
  }
}
