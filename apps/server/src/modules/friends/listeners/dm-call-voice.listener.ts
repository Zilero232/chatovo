import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import type { VoiceJoinedEvent, VoiceLeftEvent } from '../../../common/events/domain-events';

import { DomainEvent } from '../../../common/events/domain-events';
import { onDmVoiceJoined, onDmVoiceLeft } from '../call-store';

@Injectable()
export class DmCallVoiceListener {
  @OnEvent(DomainEvent.VoiceJoined)
  onVoiceJoined({ roomId, isDm, participantId }: VoiceJoinedEvent) {
    if (isDm) {
      onDmVoiceJoined({ roomId, userId: participantId });
    }
  }

  @OnEvent(DomainEvent.VoiceLeft)
  onVoiceLeft({ roomId, isDm, participantId }: VoiceLeftEvent) {
    if (isDm) {
      onDmVoiceLeft({ roomId, userId: participantId });
    }
  }
}
