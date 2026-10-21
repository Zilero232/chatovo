import type { Participant } from 'livekit-client';

import { Track } from 'livekit-client';
import { describe, expect, it } from 'vitest';

import { isMicLocked, isTokenMicLocked } from '../is-mic-locked';

const permissionsOf = ({
  canPublish = true,
  sources = []
}: {
  canPublish?: boolean;
  sources?: Track.Source[];
}) =>
  ({
    canPublish,
    canPublishSources: sources.map((source) => Track.sourceToProto(source))
  }) as unknown as Participant['permissions'];

const encodePart = (value: object) => Buffer.from(JSON.stringify(value)).toString('base64url');

const tokenWith = (video: object) =>
  `${encodePart({ alg: 'HS256', typ: 'JWT' })}.${encodePart({ sub: 'user-1', video })}.signature`;

describe('isMicLocked', () => {
  it('stays unlocked before the permissions arrive', () => {
    expect(isMicLocked(undefined)).toBe(false);
  });

  it('stays unlocked for the default grant, where an empty source list means every source', () => {
    expect(isMicLocked(permissionsOf({}))).toBe(false);
  });

  it('locks once the room owner takes the microphone out of the allowed sources', () => {
    expect(
      isMicLocked(
        permissionsOf({
          sources: [Track.Source.Camera, Track.Source.ScreenShare, Track.Source.ScreenShareAudio]
        })
      )
    ).toBe(true);
  });

  it('stays unlocked while the microphone is still among the allowed sources', () => {
    expect(
      isMicLocked(permissionsOf({ sources: [Track.Source.Microphone, Track.Source.Camera] }))
    ).toBe(false);
  });

  it('never reports a lock for an invisible admin, who cannot publish at all', () => {
    expect(isMicLocked(permissionsOf({ canPublish: false, sources: [Track.Source.Camera] }))).toBe(
      false
    );
  });
});

describe('isTokenMicLocked', () => {
  it('reads the lock a re-join token carries, so the client never asks for the microphone', () => {
    expect(
      isTokenMicLocked(
        tokenWith({
          canPublish: true,
          canPublishSources: ['camera', 'screen_share', 'screen_share_audio']
        })
      )
    ).toBe(true);
  });

  it('stays unlocked for the default grant without a source list', () => {
    expect(isTokenMicLocked(tokenWith({ canPublish: true }))).toBe(false);
  });

  it('stays unlocked for an invisible admin, who cannot publish at all', () => {
    expect(isTokenMicLocked(tokenWith({ canPublish: false, canPublishSources: ['camera'] }))).toBe(
      false
    );
  });

  it('treats a malformed token as unlocked instead of throwing', () => {
    expect(isTokenMicLocked('not-a-jwt')).toBe(false);
  });
});
