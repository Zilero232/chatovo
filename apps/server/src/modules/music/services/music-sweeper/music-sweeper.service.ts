import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';

import { sweepUploadFolder } from '../../../../lib';
import { hasRoomParticipants } from '../../../livekit';
import { MUSIC } from '../../config';
import { listMusicRoomIds } from '../../music-store';
import { RoomMusicService } from '../room-music';

@Injectable()
export class MusicSweeperService {
  private readonly logger = new Logger(MusicSweeperService.name);

  private readonly emptySince = new Map<string, number>();

  constructor(private readonly roomMusic: RoomMusicService) {}

  @Interval(MUSIC.room.sweepIntervalMs)
  sweepEmptyRooms(): void {
    const now = Date.now();
    const idleRoomIds = listMusicRoomIds().filter((roomId) => !hasRoomParticipants(roomId));
    const stillIdle = new Map(
      idleRoomIds.map((roomId) => [roomId, this.emptySince.get(roomId) ?? now])
    );

    this.emptySince.clear();

    for (const [roomId, since] of stillIdle) {
      if (now - since < MUSIC.room.emptyRoomGraceMs) {
        this.emptySince.set(roomId, since);

        continue;
      }

      this.roomMusic.clear(roomId);
    }
  }

  @Cron(MUSIC.artwork.sweepCron)
  async sweepArtwork(): Promise<number> {
    const { folder, maxAgeMs } = MUSIC.artwork;
    const { removed, total } = await sweepUploadFolder({ folder, maxAgeMs });

    if (removed > 0) {
      this.logger.log(`Removed ${removed} of ${total} music artwork images`);
    }

    return removed;
  }
}
