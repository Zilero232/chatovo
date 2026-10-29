import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackSource, WebhookReceiver } from 'livekit-server-sdk';
import { match } from 'ts-pattern';

import type {
  VoiceEmptiedEvent,
  VoiceJoinedEvent,
  VoiceLeftEvent
} from '../../../../common/events/domain-events';
import type {
  HandleWebhookInput,
  ParticipantJoinedInput,
  ParticipantLeftInput
} from './webhook.service.types';

import { DomainEvent } from '../../../../common/events/domain-events';
import { AppUnauthorizedException } from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import { getRoomLabel } from '../../../../lib';
import { WEBHOOK_CLOCK_TOLERANCE_SECONDS } from '../../config';
import { isBarredFromRoom, isInvisibleParticipant } from '../../lib';
import { toRoomParticipant } from '../../mappers';
import { clearRoomMicLocks, isMicLocked } from '../../mic-lock-store';
import {
  addParticipant,
  clearRoom,
  patchParticipant,
  removeParticipant,
  removeRoomParticipant,
  setParticipantMicLock,
  syncRoom
} from '../../presence';

@Injectable()
export class WebhookService {
  private readonly receiver: WebhookReceiver;

  constructor(
    config: AppConfigService,
    private readonly events: EventEmitter2
  ) {
    this.receiver = new WebhookReceiver(
      config.get('LIVEKIT_API_KEY'),
      config.get('LIVEKIT_API_SECRET')
    );
  }

  async handle({ body, authHeader }: HandleWebhookInput): Promise<void> {
    let event: Awaited<ReturnType<typeof this.receiver.receive>>;

    try {
      event = await this.receiver.receive(body, authHeader, false, WEBHOOK_CLOCK_TOLERANCE_SECONDS);
    } catch {
      throw new AppUnauthorizedException('WEBHOOK_SIGNATURE_INVALID', 'Invalid webhook signature');
    }

    const roomId = event.room?.name;

    if (!roomId) {
      return;
    }

    const participant = event.participant;
    const track = event.track;
    const isMicTrack = track?.source === TrackSource.MICROPHONE;

    await match(event.event)
      .with('participant_joined', async () => {
        if (participant) {
          await this.onParticipantJoined({ roomId, participant });
        }
      })
      .with('participant_left', () => {
        if (participant) {
          this.onParticipantLeft({ roomId, participant });
        }
      })
      .with('track_published', () => {
        if (participant && isMicTrack && track) {
          patchParticipant(roomId, participant.identity, { micMuted: track.muted });
        }
      })
      .with('track_unpublished', () => {
        if (participant && isMicTrack) {
          patchParticipant(roomId, participant.identity, { micMuted: true });
        }
      })
      .with('room_finished', async () => {
        clearRoom(roomId);
        clearRoomMicLocks(roomId);

        const { name: roomName } = await getRoomLabel(roomId);

        this.events.emit(DomainEvent.VoiceEmptied, {
          roomId,
          roomName
        } satisfies VoiceEmptiedEvent);
      })
      .with('room_started', () => syncRoom(roomId))
      .otherwise(() => undefined);
  }

  private async onParticipantJoined({ roomId, participant }: ParticipantJoinedInput) {
    const { identity } = participant;

    if (await isBarredFromRoom({ roomId, userId: identity })) {
      await removeRoomParticipant({ roomId, identity });

      return;
    }

    const invisible = isInvisibleParticipant(participant.metadata);

    addParticipant(roomId, toRoomParticipant({ participant, invisible }));

    if (isMicLocked({ roomId, userId: identity })) {
      await setParticipantMicLock({ roomId, identity, locked: true });
    }

    if (invisible) {
      return;
    }

    const { name: roomName, isDm } = await getRoomLabel(roomId);

    this.events.emit(DomainEvent.VoiceJoined, {
      roomId,
      roomName,
      isDm,
      participantId: identity,
      participantName: participant.name || identity
    } satisfies VoiceJoinedEvent);
  }

  private onParticipantLeft({ roomId, participant }: ParticipantLeftInput) {
    const { identity, metadata } = participant;

    removeParticipant(roomId, identity);

    if (isInvisibleParticipant(metadata)) {
      return;
    }

    this.events.emit(DomainEvent.VoiceLeft, {
      roomId,
      participantId: identity
    } satisfies VoiceLeftEvent);
  }
}
