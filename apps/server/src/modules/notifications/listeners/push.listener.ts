import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type {
  CallEndedEvent,
  CallRingingEvent,
  DmMessageSentEvent
} from '../../../common/events/domain-events';

import { DomainEvent } from '../../../common/events/domain-events';
import { runNotification } from '../../../common/notifications';
import { sendDmMessagePush, sendIncomingCallPush, sendMissedCallPush } from '../../push';
import { MISSED_CALL_OUTCOMES } from '../config';

@Injectable()
export class PushListener {
  private readonly logger = new Logger(PushListener.name);

  private run(label: string, task: Promise<unknown>) {
    return runNotification({ logger: this.logger, channel: 'Push', label, task });
  }

  @OnEvent(DomainEvent.CallRinging)
  async onCallRinging(payload: CallRingingEvent) {
    await this.run('call.ringing', sendIncomingCallPush(payload));
  }

  @OnEvent(DomainEvent.CallEnded)
  async onCallEnded({ callId, callee, caller, roomId, outcome }: CallEndedEvent) {
    if (!MISSED_CALL_OUTCOMES.has(outcome)) {
      return;
    }

    await this.run(
      'call.missed',
      sendMissedCallPush({ callId, calleeId: callee.id, caller, roomId })
    );
  }

  @OnEvent(DomainEvent.DmMessageSent)
  async onDmMessageSent(payload: DmMessageSentEvent) {
    await this.run('dm.message-sent', sendDmMessagePush(payload));
  }
}
