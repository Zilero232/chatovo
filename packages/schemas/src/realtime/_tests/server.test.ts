import { describe, expect, it } from 'vitest';

import { realtimeServerMessageSchema } from '../server';

const ROOM = {
  id: 'ae7a5ff2-ae43-400d-81fd-b460c5974599',
  name: 'evening call',
  kind: 'group',
  isPrivate: false,
  ownerId: 'ggnbGTtTjvvFSaHoGlIyrUaJlF9otTDs'
};

describe('realtimeServerMessageSchema', () => {
  it('accepts a room owned by a better-auth user id, which is not a uuid', () => {
    const parsed = realtimeServerMessageSchema.safeParse({ type: 'room.upserted', room: ROOM });

    expect(parsed.success).toBe(true);
  });

  it('accepts a removed room by its id', () => {
    const parsed = realtimeServerMessageSchema.safeParse({ type: 'room.removed', roomId: ROOM.id });

    expect(parsed.success).toBe(true);
  });

  it('rejects a removed room without an id', () => {
    expect(realtimeServerMessageSchema.safeParse({ type: 'room.removed' }).success).toBe(false);
  });

  it('accepts a moderation notice addressed to the affected participant', () => {
    const parsed = realtimeServerMessageSchema.safeParse({
      type: 'room.moderation',
      roomId: ROOM.id,
      roomName: ROOM.name,
      action: 'banned'
    });

    expect(parsed.success).toBe(true);
  });

  it('rejects a moderation notice with an action the client cannot handle', () => {
    const parsed = realtimeServerMessageSchema.safeParse({
      type: 'room.moderation',
      roomId: ROOM.id,
      roomName: ROOM.name,
      action: 'kicked'
    });

    expect(parsed.success).toBe(false);
  });
});
