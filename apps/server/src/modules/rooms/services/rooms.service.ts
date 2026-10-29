import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isNonNullish, isNullish } from 'remeda';

import type { Prisma } from '../../../../generated';
import type { RoomCreatedEvent, RoomDeletedEvent } from '../../../common/events/domain-events';
import type {
  CreateRoomInput,
  DeleteRoomInput,
  GetRoomInput,
  UpdateRoomInput
} from './rooms.service.types';

import { RoomKind } from '../../../../generated';
import { DomainEvent } from '../../../common/events/domain-events';
import { AppConflictException, AppNotFoundException } from '../../../common/exceptions';
import { PrismaService } from '../../../core';
import {
  assertCanManageRoom,
  assertCanViewRoom,
  getUserDisplayName,
  hashRoomPassword,
  retireRoom,
  roomSelect
} from '../../../lib';
import { grantRoomAccess, revokeRoomGrants } from '../../livekit';
import { emitToAll } from '../../realtime';

@Injectable()
export class RoomsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: EventEmitter2
  ) {}

  listRooms() {
    return this.prisma.room.findMany({
      where: { kind: RoomKind.group },
      orderBy: { createdAt: 'desc' },
      select: roomSelect
    });
  }

  async getRoom({ roomId, userId }: GetRoomInput) {
    await assertCanViewRoom({ roomId, userId });

    const room = await this.prisma.room.findUnique({ where: { id: roomId }, select: roomSelect });

    if (isNullish(room)) {
      throw new AppNotFoundException('ROOM_NOT_FOUND', 'Room not found');
    }

    return room;
  }

  private async assertRoomNameAvailable(name: string) {
    const existing = await this.prisma.room.findUnique({
      where: { name },
      select: { id: true }
    });

    if (existing) {
      throw new AppConflictException('ROOM_NAME_TAKEN', 'A room with this name already exists');
    }
  }

  async createRoom({ input, ownerId }: CreateRoomInput) {
    const { isPrivate, name, password } = input;

    await this.assertRoomNameAvailable(name);

    const storedPassword = isPrivate && password ? await hashRoomPassword(password) : null;

    const room = await this.prisma.room.create({
      data: { name, isPrivate, password: storedPassword, ownerId },
      select: roomSelect
    });

    const ownerName = await getUserDisplayName(ownerId);

    this.events.emit(DomainEvent.RoomCreated, {
      roomName: room.name,
      ownerName,
      isPrivate: room.isPrivate
    } satisfies RoomCreatedEvent);

    grantRoomAccess({ roomId: room.id, userId: ownerId });
    emitToAll({ type: 'room.upserted', room });

    return room;
  }

  async updateRoom({ roomId, input, userId }: UpdateRoomInput) {
    const current = await assertCanManageRoom({ roomId, userId });

    const data: Prisma.RoomUpdateInput = {};

    if (isNonNullish(input.name) && input.name !== current.name) {
      await this.assertRoomNameAvailable(input.name);
      data.name = input.name;
    }

    if (isNonNullish(input.isPrivate) && input.isPrivate !== current.isPrivate) {
      data.isPrivate = input.isPrivate;

      if (input.isPrivate === false) {
        data.password = null;
      }
    }

    if (isNonNullish(input.password)) {
      const willBePrivate = input.isPrivate ?? current.isPrivate;

      if (willBePrivate) {
        data.password = await hashRoomPassword(input.password);
      }
    }

    const updated = await this.prisma.room.update({
      where: { id: roomId },
      data,
      select: roomSelect
    });

    if ('password' in data || 'isPrivate' in data) {
      revokeRoomGrants(roomId);
      grantRoomAccess({ roomId, userId });
    }

    emitToAll({ type: 'room.upserted', room: updated });

    return updated;
  }

  async deleteRoom({ roomId, userId }: DeleteRoomInput) {
    const room = await assertCanManageRoom({ roomId, userId });
    const deleted = await this.prisma.room.delete({
      where: { id: roomId },
      select: { name: true }
    });

    await retireRoom(roomId);

    const ownerName = await getUserDisplayName(room.ownerId);

    this.events.emit(DomainEvent.RoomDeleted, {
      roomName: deleted.name,
      ownerName
    } satisfies RoomDeletedEvent);
  }
}
