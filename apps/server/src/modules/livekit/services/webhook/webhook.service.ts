import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { TrackSource, WebhookReceiver } from 'livekit-server-sdk';
import { match } from 'ts-pattern';

import type { VoiceEmptiedEvent, VoiceJoinedEvent } from '../../../../common/events/domain-events';
import type { HandleWebhookInput, ParticipantJoinedInput } from './webhook.service.types';

import { DomainEvent } from '../../../../common/events/domain-events';
import { AppUnauthorizedException } from '../../../../common/exceptions';
import { AppConfigService } from '../../../../config/config.module';
import { getRoomName } from '../../../../lib';
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
      event = await this.receiver.receive(body, authHeader);
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
          removeParticipant(roomId, participant.identity);
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

        const roomName = await getRoomName(roomId);

        this.events.emit(DomainEvent.VoiceEmptied, { roomName } satisfies VoiceEmptiedEvent);
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

    const roomName = await getRoomName(roomId);

    this.events.emit(DomainEvent.VoiceJoined, {
      roomId,
      roomName,
      participantName: participant.name || identity
    } satisfies VoiceJoinedEvent);
  }
}
