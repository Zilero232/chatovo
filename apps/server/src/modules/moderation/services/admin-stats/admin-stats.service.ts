import { STAFF_ROLES } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';
import { startOfDay, subDays } from 'date-fns';

import type { StatsWindow } from './admin-stats.service.types';

import { PrismaService } from '../../../../core';
import { getSnapshot } from '../../../livekit';
import { SERIES_DAYS } from '../../config';
import { toDaySeries } from '../../lib';

@Injectable()
export class AdminStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async read() {
    const today = startOfDay(new Date());

    const window: StatsWindow = {
      today,
      weekAgo: subDays(today, 7),
      seriesFrom: subDays(today, SERIES_DAYS - 1)
    };

    const snapshot = getSnapshot();

    const [users, rooms, messages, reports, series] = await Promise.all([
      this.countUsers(window),
      this.countRooms(),
      this.countMessages(window),
      this.countReports(),
      this.readSeries(window)
    ]);

    return {
      users: { ...users, online: snapshot.lobbyOnline },
      rooms: {
        ...rooms,
        dm: rooms.total - rooms.group,
        liveNow: Object.keys(snapshot.rooms).length
      },
      messages,
      reports,
      ...series
    };
  }

  private async countUsers({ today, weekAgo }: StatsWindow) {
    const [total, blocked, staff, newToday, newThisWeek] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { banned: true } }),
      this.prisma.user.count({ where: { role: { in: STAFF_ROLES } } }),
      this.prisma.user.count({ where: { createdAt: { gte: today } } }),
      this.prisma.user.count({ where: { createdAt: { gte: weekAgo } } })
    ]);

    return { total, blocked, staff, newToday, newThisWeek };
  }

  private async countRooms() {
    const [total, group, privateRooms] = await Promise.all([
      this.prisma.room.count(),
      this.prisma.room.count({ where: { kind: 'group' } }),
      this.prisma.room.count({ where: { isPrivate: true } })
    ]);

    return { total, group, private: privateRooms };
  }

  private async countMessages({ today, weekAgo }: StatsWindow) {
    const [total, todayCount, thisWeek] = await Promise.all([
      this.prisma.message.count({ where: { deletedAt: null } }),
      this.prisma.message.count({ where: { deletedAt: null, createdAt: { gte: today } } }),
      this.prisma.message.count({ where: { deletedAt: null, createdAt: { gte: weekAgo } } })
    ]);

    return { total, today: todayCount, thisWeek };
  }

  private async countReports() {
    const [pending, handled] = await Promise.all([
      this.prisma.abuseReport.count({ where: { handled: false } }),
      this.prisma.abuseReport.count({ where: { handled: true } })
    ]);

    return { pending, handled };
  }

  private async readSeries({ seriesFrom }: StatsWindow) {
    const [signupRows, messageRows] = await Promise.all([
      this.prisma.user.findMany({
        where: { createdAt: { gte: seriesFrom } },
        select: { createdAt: true }
      }),
      this.prisma.message.findMany({
        where: { deletedAt: null, createdAt: { gte: seriesFrom } },
        select: { createdAt: true }
      })
    ]);

    return {
      signups: toDaySeries({ rows: signupRows, from: seriesFrom, days: SERIES_DAYS }),
      messagesSeries: toDaySeries({ rows: messageRows, from: seriesFrom, days: SERIES_DAYS })
    };
  }
}
