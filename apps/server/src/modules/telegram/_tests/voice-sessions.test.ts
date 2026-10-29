import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { VoiceRoomSnapshot } from '../telegram.types';

const postMessage = vi.fn();
const editMessage = vi.fn();

let snapshot: VoiceRoomSnapshot = { presence: {}, track: null };

vi.mock('../bot', () => ({
  isTelegramEnabled: () => true,
  postMessage: (input: unknown) => postMessage(input),
  editMessage: (input: unknown) => editMessage(input)
}));

vi.mock('../links', () => ({
  roomUrl: (roomId: string) => `https://app.test/room?id=${roomId}`
}));

vi.mock('../voice-room-state', () => ({
  readVoiceRoom: () => snapshot
}));

const {
  VOICE_ABANDON_AFTER_MS,
  VOICE_FLUSH_DELAY_MS,
  VOICE_MAX_DELIVERY_ATTEMPTS,
  VOICE_MIN_EDIT_GAP_MS,
  VOICE_REFRESH_INTERVAL_MS,
  VOICE_RETRY_DELAY_MS
} = await import('../config');
const { notifyVoiceEmpty, notifyVoiceJoin, notifyVoiceLeave } = await import('../voice-sessions');

let roomCounter = 0;

const nextRoom = () => {
  roomCounter += 1;

  return `room-${roomCounter}`;
};

const join = (roomId: string, participantId: string) =>
  notifyVoiceJoin({
    roomId,
    roomName: 'Test',
    isDm: false,
    participantId,
    participantName: participantId
  });

const textOf = (mock: typeof postMessage, call = 0): string =>
  (mock.mock.calls.at(call)?.[0] as { message: { text: string } }).message.text;

const startRoom = async (participantId = 'anna') => {
  const roomId = nextRoom();

  await join(roomId, participantId);
  await vi.advanceTimersByTimeAsync(VOICE_FLUSH_DELAY_MS);

  return roomId;
};

describe('voice session notifications', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    snapshot = { presence: {}, track: null };
    postMessage.mockReset().mockResolvedValue(42);
    editMessage.mockReset().mockResolvedValue({ kind: 'edited' });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('coalesces joins that land together into a single loud post', async () => {
    const roomId = nextRoom();

    await join(roomId, 'anna');
    await join(roomId, 'boris');
    await vi.advanceTimersByTimeAsync(VOICE_FLUSH_DELAY_MS);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(postMessage.mock.calls[0]?.[0]).toMatchObject({ silent: false });
    expect(textOf(postMessage)).toContain('Сейчас в канале (2):\n• anna\n• boris');
    expect(editMessage).not.toHaveBeenCalled();
  });

  it('keeps a private DM call out of the channel, including its leave and end', async () => {
    const roomId = nextRoom();

    await notifyVoiceJoin({
      roomId,
      roomName: 'dm',
      isDm: true,
      participantId: 'anna',
      participantName: 'anna'
    });
    await notifyVoiceLeave({ roomId, participantId: 'anna' });
    await notifyVoiceEmpty({ roomId, roomName: 'dm' });
    await vi.advanceTimersByTimeAsync(VOICE_FLUSH_DELAY_MS);

    expect(postMessage).not.toHaveBeenCalled();
    expect(editMessage).not.toHaveBeenCalled();
  });

  it('edits the same message on a later join or leave instead of posting again', async () => {
    const roomId = await startRoom();

    await join(roomId, 'boris');
    await notifyVoiceLeave({ roomId, participantId: 'anna' });
    await vi.advanceTimersByTimeAsync(VOICE_MIN_EDIT_GAP_MS);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(editMessage).toHaveBeenCalledTimes(1);
    expect(textOf(editMessage)).toContain('Сейчас в канале (1):\n• boris');
  });

  it('keeps at least the minimum gap between two edits of one message', async () => {
    const roomId = await startRoom();

    await join(roomId, 'boris');
    await vi.advanceTimersByTimeAsync(VOICE_MIN_EDIT_GAP_MS);
    await join(roomId, 'clara');
    await vi.advanceTimersByTimeAsync(VOICE_MIN_EDIT_GAP_MS - 1);

    expect(editMessage).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(1);

    expect(editMessage).toHaveBeenCalledTimes(2);
  });

  it('skips the edit when a quick leave and rejoin change nothing', async () => {
    const roomId = await startRoom();

    await notifyVoiceLeave({ roomId, participantId: 'anna' });
    await join(roomId, 'anna');
    await vi.advanceTimersByTimeAsync(VOICE_MIN_EDIT_GAP_MS);

    expect(postMessage).toHaveBeenCalledTimes(1);
    expect(editMessage).not.toHaveBeenCalled();
  });

  it('picks up a presence change on the periodic refresh', async () => {
    await startRoom();

    snapshot = {
      presence: { anna: { micMuted: true, deafened: false, activity: null } },
      track: null
    };
    await vi.advanceTimersByTimeAsync(VOICE_REFRESH_INTERVAL_MS + VOICE_FLUSH_DELAY_MS);

    expect(editMessage).toHaveBeenCalledTimes(1);
    expect(textOf(editMessage)).toContain('• anna · 🔇');
  });

  it('leaves the message alone on a refresh that changes nothing visible', async () => {
    await startRoom();

    await vi.advanceTimersByTimeAsync(VOICE_REFRESH_INTERVAL_MS * 2);

    expect(editMessage).not.toHaveBeenCalled();
  });

  it('turns the message into a summary once the room empties', async () => {
    const roomId = await startRoom();

    await notifyVoiceLeave({ roomId, participantId: 'anna' });
    await notifyVoiceEmpty({ roomId, roomName: 'Test' });

    expect(editMessage).toHaveBeenCalledTimes(1);
    expect(textOf(editMessage)).toContain(
      'опустел · меньше минуты\nМаксимум одновременно: 1\nБыли (1):\n• anna — меньше минуты'
    );
  });

  it('closes a session whose room never reported finishing', async () => {
    const roomId = await startRoom();

    await notifyVoiceLeave({ roomId, participantId: 'anna' });
    await vi.advanceTimersByTimeAsync(VOICE_ABANDON_AFTER_MS + VOICE_REFRESH_INTERVAL_MS);

    expect(textOf(editMessage, -1)).toContain('опустел');

    const editsAfterClose = editMessage.mock.calls.length;

    await vi.advanceTimersByTimeAsync(VOICE_REFRESH_INTERVAL_MS * 2);

    expect(editMessage).toHaveBeenCalledTimes(editsAfterClose);
  });

  it('starts a fresh session after the room has emptied', async () => {
    const roomId = await startRoom();

    await notifyVoiceEmpty({ roomId, roomName: 'Test' });
    await join(roomId, 'boris');
    await vi.advanceTimersByTimeAsync(VOICE_FLUSH_DELAY_MS);

    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(textOf(postMessage, 1)).toContain('Сейчас в канале (1):\n• boris');
  });

  it('posts a quiet replacement when the old message was deleted', async () => {
    const roomId = await startRoom();

    editMessage.mockResolvedValueOnce({ kind: 'missing' });
    await join(roomId, 'boris');
    await vi.advanceTimersByTimeAsync(VOICE_MIN_EDIT_GAP_MS);

    expect(postMessage).toHaveBeenCalledTimes(2);
    expect(postMessage.mock.calls[1]?.[0]).toMatchObject({ silent: true });
  });

  it('retries a failed edit and gives up after the attempt limit', async () => {
    const roomId = await startRoom();

    editMessage.mockResolvedValue({ kind: 'failed', retryAfterMs: null });
    await join(roomId, 'boris');
    await vi.advanceTimersByTimeAsync(VOICE_MIN_EDIT_GAP_MS);
    await vi.advanceTimersByTimeAsync(VOICE_RETRY_DELAY_MS * VOICE_MAX_DELIVERY_ATTEMPTS);

    expect(editMessage).toHaveBeenCalledTimes(VOICE_MAX_DELIVERY_ATTEMPTS);
    expect(postMessage).toHaveBeenCalledTimes(1);
  });

  it('ignores the end of a room it never saw anyone join', async () => {
    await notifyVoiceEmpty({ roomId: nextRoom(), roomName: 'Test' });

    expect(postMessage).not.toHaveBeenCalled();
    expect(editMessage).not.toHaveBeenCalled();
  });
});
