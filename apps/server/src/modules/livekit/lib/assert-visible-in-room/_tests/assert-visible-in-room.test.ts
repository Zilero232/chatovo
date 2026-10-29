import { describe, expect, it, vi } from 'vitest';

const findRoomParticipant = vi.fn();

vi.mock('../../../presence-store', () => ({
  findRoomParticipant: (input: unknown) => findRoomParticipant(input)
}));

const { assertVisibleInRoom, isInvisibleInRoom } = await import('../assert-visible-in-room');

const LOOKUP = { roomId: 'room-1', identity: 'user-1' };

describe('isInvisibleInRoom', () => {
  it('treats someone outside the voice call as visible', () => {
    findRoomParticipant.mockReturnValueOnce(null);

    expect(isInvisibleInRoom(LOOKUP)).toBe(false);
  });

  it('spots an admin sitting in the call invisibly', () => {
    findRoomParticipant.mockReturnValueOnce({ invisible: true });

    expect(isInvisibleInRoom(LOOKUP)).toBe(true);
  });
});

describe('assertVisibleInRoom', () => {
  it('refuses an invisible participant with INVISIBLE_READ_ONLY', () => {
    findRoomParticipant.mockReturnValueOnce({ invisible: true });

    expect(() => assertVisibleInRoom(LOOKUP)).toThrow(
      expect.objectContaining({
        response: expect.objectContaining({ code: 'INVISIBLE_READ_ONLY' })
      })
    );
  });

  it('lets a visible participant through', () => {
    findRoomParticipant.mockReturnValueOnce({ invisible: false });

    expect(() => assertVisibleInRoom(LOOKUP)).not.toThrow();
  });
});
