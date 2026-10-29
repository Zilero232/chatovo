import type {
  DmCallView,
  IncomingFriendCall,
  IncomingFriendCallResponse,
  OutgoingFriendCallResponse,
  Room
} from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';
import { isNullish } from 'remeda';
import { match } from 'ts-pattern';

import type { DmCall } from '../../friends.types';
import type {
  DmCallActionInput,
  RequireDmCallInput,
  RingFriendCallInput
} from './friend-call.service.types';

import { AppConflictException, AppNotFoundException } from '../../../../common/exceptions';
import { PrismaService } from '../../../../core';
import { getUserWithProfileOrThrow } from '../../../../lib';
import { hasUserConnection } from '../../../realtime';
import {
  acceptDmCall,
  ackLegacyCall,
  cancelDmCall,
  declineDmCall,
  findCall,
  findCurrentCall,
  findIncomingCall,
  getUserCallSnapshot,
  hangupDmCall,
  startDmCall,
  toCallView
} from '../../call-store';
import { toFriendUser } from '../../mappers';
import { DmRoomService } from '../dm-room';

@Injectable()
export class FriendCallService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dmRoom: DmRoomService
  ) {}

  private async beginCall({ userId, otherUserId }: RingFriendCallInput) {
    const room = await this.dmRoom.getOrCreateDmRoom({ userId, otherUserId });

    const [caller, callee, pushDevices] = await Promise.all([
      getUserWithProfileOrThrow(userId),
      getUserWithProfileOrThrow(otherUserId),
      this.prisma.pushDevice.count({ where: { userId: otherUserId } })
    ]);

    const call = startDmCall({
      roomId: room.id,
      caller: toFriendUser(caller),
      callee: toFriendUser(callee),
      calleeReachable: hasUserConnection(otherUserId) || pushDevices > 0
    });

    return { room, call };
  }

  async startCall(input: RingFriendCallInput): Promise<DmCallView> {
    const { call } = await this.beginCall(input);

    return toCallView(call, input.userId);
  }

  async ringFriendCall(input: RingFriendCallInput): Promise<Room> {
    const { room } = await this.beginCall(input);

    return room;
  }

  private requireCall({ callId, userId, role }: RequireDmCallInput): DmCall {
    const call = findCall(callId);

    const isAllowed =
      call !== null &&
      match(role)
        .with('caller', () => call.caller.id === userId)
        .with('callee', () => call.callee.id === userId)
        .with('participant', () => call.caller.id === userId || call.callee.id === userId)
        .exhaustive();

    if (!call || !isAllowed) {
      throw new AppNotFoundException('CALL_NOT_FOUND', 'Call not found');
    }

    if (call.state === 'ended') {
      throw new AppConflictException('CALL_ENDED', 'The call has already ended');
    }

    return call;
  }

  async acceptCall({ callId, userId }: DmCallActionInput): Promise<DmCallView> {
    const call = this.requireCall({ callId, userId, role: 'callee' });

    if (call.state !== 'ringing') {
      return toCallView(call, userId);
    }

    return toCallView(acceptDmCall(callId) ?? call, userId);
  }

  async declineCall({ callId, userId }: DmCallActionInput): Promise<void> {
    this.requireCall({ callId, userId, role: 'callee' });

    declineDmCall(callId);
  }

  async cancelCall({ callId, userId }: DmCallActionInput): Promise<void> {
    this.requireCall({ callId, userId, role: 'caller' });

    cancelDmCall(callId);
  }

  async hangupCall({ callId, userId }: DmCallActionInput): Promise<void> {
    this.requireCall({ callId, userId, role: 'participant' });

    hangupDmCall({ callId, userId });
  }

  async getIncomingFriendCall(userId: string): Promise<IncomingFriendCallResponse> {
    return { call: getUserCallSnapshot(userId).incoming };
  }

  async acceptIncomingFriendCall(userId: string): Promise<IncomingFriendCall | null> {
    const incoming = findIncomingCall(userId);

    if (isNullish(incoming)) {
      return null;
    }

    acceptDmCall(incoming.id);

    return { roomId: incoming.roomId, caller: incoming.caller };
  }

  async declineIncomingFriendCall(userId: string): Promise<void> {
    const incoming = findIncomingCall(userId);

    if (incoming) {
      declineDmCall(incoming.id);
    }
  }

  async getOutgoingFriendCall(userId: string): Promise<OutgoingFriendCallResponse> {
    return { call: getUserCallSnapshot(userId).outgoing };
  }

  async ackOutgoingFriendCall(userId: string): Promise<void> {
    const current = findCurrentCall(userId);

    if (current && current.caller.id === userId) {
      ackLegacyCall(current.id);
    }
  }

  async cancelOutgoingFriendCall(userId: string): Promise<void> {
    const current = findCurrentCall(userId);

    if (current && current.caller.id === userId && current.state === 'ringing') {
      cancelDmCall(current.id);
    }
  }
}
