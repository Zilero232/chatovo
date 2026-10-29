import { describe, expect, it, vi } from 'vitest';

const findRoomParticipant = vi.fn();
const readRoomMusic = vi.fn();

vi.mock('../../livekit', () => ({
  findRoomParticipant: (input: unknown) => findRoomParticipant(input)
}));

vi.mock('../../music', () => ({
  readRoomMusic: (roomId: string) => readRoomMusic(roomId)
}));

const { readVoiceRoom } = await import('../voice-room-state');

const TRACK = { title: 'Veridis Quo', artist: 'Daft Punk' };

const ANNA = {
  identity: 'anna',
  micMuted: true,
  deafened: false,
  activity: 'Dota 2',
  invisible: false
};

describe('readVoiceRoom', () => {
  it('keeps the presence of people the store knows and skips the rest', () => {
    findRoomParticipant.mockImplementation(({ identity }: { identity: string }) =>
      identity === 'anna' ? ANNA : null
    );
    readRoomMusic.mockReturnValue({ current: null, playback: null });

    expect(readVoiceRoom({ roomId: 'room-1', participantIds: ['anna', 'gone'] })).toEqual({
      presence: { anna: { micMuted: true, deafened: false, activity: 'Dota 2' } },
      track: null
    });
  });

  it('shows the room track only while it plays', () => {
    findRoomParticipant.mockReturnValue(null);

    readRoomMusic.mockReturnValueOnce({
      current: TRACK,
      playback: { status: 'playing', startedAt: 0 }
    });
    expect(readVoiceRoom({ roomId: 'room-1', participantIds: [] }).track).toEqual(TRACK);

    readRoomMusic.mockReturnValueOnce({
      current: TRACK,
      playback: { status: 'paused', positionMs: 1000 }
    });
    expect(readVoiceRoom({ roomId: 'room-1', participantIds: [] }).track).toBeNull();
  });
});
