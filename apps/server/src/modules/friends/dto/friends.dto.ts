import {
  friendListSchema,
  friendRequestListSchema,
  friendUserSchema,
  incomingFriendCallResponseSchema,
  outgoingFriendCallResponseSchema,
  roomSchema,
  sendFriendRequestInputSchema,
  userBlockEntrySchema,
  userBlockListSchema
} from '@chatovo/schemas';
import { createZodDto } from 'nestjs-zod';

export class SendFriendRequestDto extends createZodDto(sendFriendRequestInputSchema) {}

export class FriendListDto extends createZodDto(friendListSchema) {}

export class FriendRequestListDto extends createZodDto(friendRequestListSchema) {}

export class FriendUserDto extends createZodDto(friendUserSchema) {}

export class RoomDto extends createZodDto(roomSchema) {}

export class IncomingFriendCallResponseDto extends createZodDto(incomingFriendCallResponseSchema) {}

export class OutgoingFriendCallResponseDto extends createZodDto(outgoingFriendCallResponseSchema) {}

export class UserBlockEntryDto extends createZodDto(userBlockEntrySchema) {}

export class UserBlockListDto extends createZodDto(userBlockListSchema) {}
