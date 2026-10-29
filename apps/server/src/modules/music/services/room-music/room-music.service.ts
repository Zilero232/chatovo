import type { RoomMusic } from '@chatovo/schemas';

import { MUSIC_QUEUE_MAX_LENGTH } from '@chatovo/schemas';
import { Injectable } from '@nestjs/common';

import type { WriteRoomMusicInput } from '../../music.types';
import type {
  ControlMusicInput,
  DequeueMusicInput,
  EnqueueMusicInput,
  RoomMusicAccessInput
} from '../music.service.types';

import {
  AppConflictException,
  AppForbiddenException,
  AppNotFoundException
} from '../../../../common/exceptions';
import { assertCanAccessRoom, getUserDisplayName } from '../../../../lib';
import { assertVisibleInRoom, findRoomParticipant, syncRoom } from '../../../livekit';
import { emitRoomEvent } from '../../../realtime';
import { EMPTY_ROOM_MUSIC } from '../../config';
import { applyMusicPlayback, enqueueMusicTrack, removeMusicTrack } from '../../lib';
import { readRoomMusic, readRoomMusicRevision, writeRoomMusic } from '../../music-store';
import { MusicResolverService } from '../music-resolver';

@Injectable()
export class RoomMusicService {
  constructor(private readonly resolver: MusicResolverService) {}

  private snapshot(roomId: string): RoomMusic {
    const { current, playback, queue } = readRoomMusic(roomId);

    return {
      roomId,
      current,
      playback,
      queue,
      revision: readRoomMusicRevision(roomId),
      serverTime: Date.now()
    };
  }

  private commit({ roomId, state }: WriteRoomMusicInput): RoomMusic {
    writeRoomMusic({ roomId, state });

    const music = this.snapshot(roomId);

    emitRoomEvent(roomId, { type: 'room.music', music });

    return music;
  }

  private async assertVisibleParticipant({ roomId, userId }: RoomMusicAccessInput): Promise<void> {
    const lookup = { roomId, identity: userId };
    const known = findRoomParticipant(lookup);

    if (!known) {
      await syncRoom(roomId);
    }

    const participant = known ?? findRoomParticipant(lookup);

    if (!participant) {
      throw new AppForbiddenException('MUSIC_NOT_IN_ROOM', 'Join the room to control its music');
    }

    assertVisibleInRoom(lookup);
  }

  private assertQueueHasRoom(roomId: string): void {
    if (readRoomMusic(roomId).queue.length >= MUSIC_QUEUE_MAX_LENGTH) {
      throw new AppConflictException('MUSIC_QUEUE_FULL', 'The music queue is full');
    }
  }

  async getRoomMusic({ roomId, userId }: RoomMusicAccessInput): Promise<RoomMusic> {
    await assertCanAccessRoom({ roomId, userId });

    return this.snapshot(roomId);
  }

  async enqueue({ roomId, userId, item }: EnqueueMusicInput): Promise<RoomMusic> {
    await this.assertVisibleParticipant({ roomId, userId });
    this.assertQueueHasRoom(roomId);

    const [track, name] = await Promise.all([
      this.resolver.resolve(item),
      getUserDisplayName(userId)
    ]);

    this.assertQueueHasRoom(roomId);

    const state = enqueueMusicTrack({
      state: readRoomMusic(roomId),
      track: { ...track, addedBy: { id: userId, name } },
      now: Date.now()
    });

    return this.commit({ roomId, state });
  }

  async dequeue({ roomId, userId, trackId }: DequeueMusicInput): Promise<RoomMusic> {
    await this.assertVisibleParticipant({ roomId, userId });

    const state = removeMusicTrack({ state: readRoomMusic(roomId), trackId, now: Date.now() });

    if (!state) {
      throw new AppNotFoundException('MUSIC_TRACK_NOT_FOUND', 'Track is not in the queue');
    }

    return this.commit({ roomId, state });
  }

  async control({ roomId, userId, command }: ControlMusicInput): Promise<RoomMusic> {
    await this.assertVisibleParticipant({ roomId, userId });

    const state = applyMusicPlayback({ state: readRoomMusic(roomId), command, now: Date.now() });

    return state ? this.commit({ roomId, state }) : this.snapshot(roomId);
  }

  clear(roomId: string): void {
    this.commit({ roomId, state: EMPTY_ROOM_MUSIC });
  }
}
