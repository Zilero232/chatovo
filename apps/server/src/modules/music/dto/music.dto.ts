import {
  musicEnqueueInputSchema,
  musicPlaybackInputSchema,
  radioSearchQuerySchema,
  radioStationsResponseSchema,
  roomMusicSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class MusicEnqueueDto extends createZodDto(musicEnqueueInputSchema) {}

export class MusicPlaybackDto extends createZodDto(musicPlaybackInputSchema) {}

export class RadioSearchQueryDto extends createZodDto(radioSearchQuerySchema) {}

export class RoomMusicDto extends createZodDto(roomMusicSchema) {}

export class RadioStationsResponseDto extends createZodDto(radioStationsResponseSchema) {}
