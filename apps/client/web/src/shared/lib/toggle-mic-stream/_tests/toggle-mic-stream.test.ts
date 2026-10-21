import type { LocalParticipant } from 'livekit-client';

import { describe, expect, it } from 'vitest';

import { toggleMicStream } from '../toggle-mic-stream';

const mockParticipant = ({ enabled, isMuted }: { enabled: boolean; isMuted: boolean }) => {
  const stream = { enabled };
  const participant = {
    getTrackPublication: () => ({ isMuted, track: { mediaStreamTrack: stream } })
  } as unknown as LocalParticipant;

  return { participant, stream };
};

describe('toggleMicStream', () => {
  it('opens the stream of an unmuted mic', () => {
    const { participant, stream } = mockParticipant({ enabled: false, isMuted: false });

    expect(toggleMicStream(participant, true)).toBe(true);
    expect(stream.enabled).toBe(true);
  });

  it('never opens the stream of a muted mic', () => {
    const { participant, stream } = mockParticipant({ enabled: false, isMuted: true });

    expect(toggleMicStream(participant, true)).toBe(false);
    expect(stream.enabled).toBe(false);
  });

  it('still closes the stream of a muted mic', () => {
    const { participant, stream } = mockParticipant({ enabled: true, isMuted: true });

    expect(toggleMicStream(participant, false)).toBe(true);
    expect(stream.enabled).toBe(false);
  });

  it('does nothing without a published mic', () => {
    const participant = { getTrackPublication: () => undefined } as unknown as LocalParticipant;

    expect(toggleMicStream(participant, true)).toBe(false);
  });
});
