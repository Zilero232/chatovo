import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { createMusicCacheStore } from './lib';
import { MusicController } from './music.controller';
import {
  MusicResolverService,
  MusicSweeperService,
  RadioService,
  RoomMusicService
} from './services';

@Module({
  imports: [CacheModule.register({ stores: [createMusicCacheStore()] })],
  controllers: [MusicController],
  providers: [MusicResolverService, MusicSweeperService, RadioService, RoomMusicService]
})
export class MusicModule {}
