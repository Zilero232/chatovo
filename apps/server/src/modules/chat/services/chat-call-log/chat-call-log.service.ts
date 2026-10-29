import type { ChatCallLog } from '@chatovo/schemas';

import { Injectable } from '@nestjs/common';

import type { CallEndedEvent } from '../../../../common/events/domain-events';

import { MessageKind } from '../../../../../generated';
import { PrismaService } from '../../../../core';
import { senderSelect } from '../../../../lib';
import { emitChatEvent } from '../../emit-chat-event';
import { describeCallLog } from '../../lib';
import { toChatMessage } from '../../mappers';

@Injectable()
export class ChatCallLogService {
  constructor(private readonly prisma: PrismaService) {}

  async recordCall({ roomId, caller, outcome, durationSec }: CallEndedEvent): Promise<void> {
    if (outcome === 'blocked') {
      return;
    }

    const call: ChatCallLog = { outcome, durationSec, callerId: caller.id };

    const message = await this.prisma.message.create({
      data: {
        roomId,
        senderId: caller.id,
        kind: MessageKind.call,
        call,
        body: describeCallLog({ outcome, durationSec })
      },
      include: { sender: senderSelect }
    });

    await emitChatEvent(roomId, { type: 'chat.message', message: toChatMessage(message) });
  }
}
