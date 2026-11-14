import type { AdminRoomQuery } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';

import type { Prisma } from '../../../../../generated';

import { AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { retireRoom } from '../../../../lib';
import { getSnapshot } from '../../../livekit';
import { toPageArgs } from '../../lib';
import {
  adminRoomInclude,
  adminRoomMessageInclude,
  toAdminRoom,
  toAdminRoomMessage
} from '../../mappers';
import { ListRoomMessagesInput } from '../../moderation.service.types';

@Injectable()
export class AdminRoomService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: AdminRoomQuery) {
    const { search, page, perPage } = query;

    const where: Prisma.RoomWhereInput = search
      ? { name: { contains: search, mode: 'insensitive' } }
      : {};

    const [items, total] = await Promise.all([
      this.prisma.room.findMany({
        where,
        include: adminRoomInclude,
        orderBy: { createdAt: 'desc' },
        ...toPageArgs({ page, perPage })
      }),
      this.prisma.room.count({ where })
    ]);

    const snapshot = getSnapshot();

    return {
      items: items.map((room) =>
        toAdminRoom({ room, participants: snapshot.rooms[room.id]?.length ?? 0 })
      ),
      total
    };
  }

  async messages({ roomId, query }: ListRoomMessagesInput) {
    const { page, perPage } = query;
    const where = { roomId };

    const [items, total] = await Promise.all([
      this.prisma.message.findMany({
        where,
        include: adminRoomMessageInclude,
        orderBy: { createdAt: 'desc' },
        ...toPageArgs({ page, perPage })
      }),
      this.prisma.message.count({ where })
    ]);

    return { items: items.map(toAdminRoomMessage), total };
  }

  async remove(roomId: string) {
    const room = await this.prisma.room.findUnique({ where: { id: roomId }, select: { id: true } });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    await this.prisma.room.delete({ where: { id: roomId } });

    await retireRoom(roomId);
  }
}
