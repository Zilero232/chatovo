import {
  createRoomInputSchema,
  roomBanListSchema,
  roomSchema,
  updateRoomInputSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class RoomDto extends createZodDto(roomSchema) {}

export class CreateRoomDto extends createZodDto(createRoomInputSchema) {}

export class UpdateRoomDto extends createZodDto(updateRoomInputSchema) {}

export class RoomBanListDto extends createZodDto(roomBanListSchema) {}
