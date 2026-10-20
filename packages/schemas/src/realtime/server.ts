import { z } from 'zod';

import { chatMessageSchema } from '../chat/outputs';
import { friendCallStreamSnapshotSchema } from '../friends/outputs';
import { roomsParticipantsSnapshotSchema } from '../livekit/outputs';
import { roomMusicSchema } from '../music/outputs';
import { roomSchema } from '../rooms/outputs';
import { soundboardSoundSchema } from './soundboard';

export const realtimeRoomKindSchema = roomSchema.shape.kind;

export const realtimeChatMessageEventSchema = z.object({
  type: z.literal('chat.message'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  message: chatMessageSchema
});

export const realtimeChatEditEventSchema = z.object({
  type: z.literal('chat.edit'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  id: z.uuid(),
  body: z.string(),
  editedAt: z.string()
});

export const realtimeChatDeleteEventSchema = z.object({
  type: z.literal('chat.delete'),
  roomId: roomSchema.shape.id,
  roomKind: realtimeRoomKindSchema,
  id: z.uuid(),
  deletedAt: z.string()
});

export const realtimeRoomReactionEventSchema = z.object({
  type: z.literal('room.reaction'),
  roomId: roomSchema.shape.id,
  emoji: z.string(),
  senderId: z.string()
});

export const realtimeRoomSoundboardEventSchema = z.object({
  type: z.literal('room.soundboard'),
  roomId: roomSchema.shape.id,
  sound: soundboardSoundSchema,
  senderId: z.string()
});

export const realtimeRoomMusicEventSchema = z.object({
  type: z.literal('room.music'),
  music: roomMusicSchema
});

export const realtimePresenceSnapshotEventSchema = z.object({
  type: z.literal('presence.snapshot'),
  snapshot: roomsParticipantsSnapshotSchema
});

export const realtimeFriendsSnapshotEventSchema = z.object({
  type: z.literal('friends.snapshot'),
  snapshot: friendCallStreamSnapshotSchema
});

export const realtimeFriendPresenceEventSchema = z.object({
  type: z.literal('friend.presence'),
  userId: z.string(),
  isOnline: z.boolean()
});

export const realtimeRoomUpsertedEventSchema = z.object({
  type: z.literal('room.upserted'),
  room: roomSchema
});

export const realtimeRoomRemovedEventSchema = z.object({
  type: z.literal('room.removed'),
  roomId: z.uuid()
});

export const realtimeServerMessageSchema = z.discriminatedUnion('type', [
  realtimeChatMessageEventSchema,
  realtimeChatEditEventSchema,
  realtimeChatDeleteEventSchema,
  realtimeRoomReactionEventSchema,
  realtimeRoomSoundboardEventSchema,
  realtimeRoomMusicEventSchema,
  realtimePresenceSnapshotEventSchema,
  realtimeFriendsSnapshotEventSchema,
  realtimeFriendPresenceEventSchema,
  realtimeRoomUpsertedEventSchema,
  realtimeRoomRemovedEventSchema
]);
