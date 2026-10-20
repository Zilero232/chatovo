import { Body, Controller, Delete, Get, HttpCode, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ZodResponse } from 'nestjs-zod';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { MUSIC } from './config';
import {
  MusicEnqueueDto,
  MusicPlaybackDto,
  RadioSearchQueryDto,
  RadioStationsResponseDto,
  RoomMusicDto
} from './dto/music.dto';
import { RadioService, RoomMusicService } from './services';

@ApiTags('music')
@Controller('music')
export class MusicController {
  constructor(
    private readonly roomMusic: RoomMusicService,
    private readonly radio: RadioService
  ) {}

  @Get('radio')
  @Throttle({ default: MUSIC.throttle.read })
  @ZodResponse({ type: RadioStationsResponseDto })
  searchRadio(@Query() query: RadioSearchQueryDto) {
    return this.radio.search(query.query);
  }

  @Get('rooms/:roomId')
  @ZodResponse({ type: RoomMusicDto })
  getRoomMusic(@Param('roomId') roomId: string, @CurrentUser() userId: string) {
    return this.roomMusic.getRoomMusic({ roomId, userId });
  }

  @Post('rooms/:roomId/queue')
  @Throttle({ default: MUSIC.throttle.write })
  @ZodResponse({ status: 201, type: RoomMusicDto })
  enqueue(
    @Param('roomId') roomId: string,
    @Body() body: MusicEnqueueDto,
    @CurrentUser() userId: string
  ) {
    return this.roomMusic.enqueue({ roomId, userId, item: body.item });
  }

  @Delete('rooms/:roomId/queue/:trackId')
  @Throttle({ default: MUSIC.throttle.write })
  @ZodResponse({ type: RoomMusicDto })
  dequeue(
    @Param('roomId') roomId: string,
    @Param('trackId') trackId: string,
    @CurrentUser() userId: string
  ) {
    return this.roomMusic.dequeue({ roomId, userId, trackId });
  }

  @Post('rooms/:roomId/playback')
  @HttpCode(200)
  @Throttle({ default: MUSIC.throttle.write })
  @ZodResponse({ type: RoomMusicDto })
  control(
    @Param('roomId') roomId: string,
    @Body() body: MusicPlaybackDto,
    @CurrentUser() userId: string
  ) {
    return this.roomMusic.control({ roomId, userId, command: body.command });
  }
}
