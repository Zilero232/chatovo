import { describe, expect, it } from 'vitest';

import { PARTICIPANT_MUSIC_VOLUME } from '../../../config/music';
import {
  readParticipantMusicVolume,
  writeParticipantMusicVolume
} from '../participant-music-volume';

describe('readParticipantMusicVolume', () => {
  it('plays an unknown sharer at full volume', () => {
    expect(readParticipantMusicVolume({ identity: 'a', isBlocked: false, volumes: {} })).toBe(1);
  });

  it('uses the stored volume for that sharer', () => {
    expect(
      readParticipantMusicVolume({ identity: 'a', isBlocked: false, volumes: { a: 0.4 } })
    ).toBe(0.4);
  });

  it('silences a blocked sharer whatever was stored', () => {
    expect(
      readParticipantMusicVolume({ identity: 'a', isBlocked: true, volumes: { a: 0.4 } })
    ).toBe(0);
  });
});

describe('writeParticipantMusicVolume', () => {
  it('stores a changed volume and clamps it into range', () => {
    expect(writeParticipantMusicVolume({ identity: 'a', volume: 0.3, volumes: {} })).toEqual({
      a: 0.3
    });
    expect(writeParticipantMusicVolume({ identity: 'a', volume: -1, volumes: {} })).toEqual({
      a: 0
    });
  });

  it('drops the entry once the volume is back at the default', () => {
    expect(writeParticipantMusicVolume({ identity: 'a', volume: 1, volumes: { a: 0.3 } })).toEqual(
      {}
    );
  });

  it('keeps only the most recent sharers', () => {
    const volumes = Object.fromEntries(
      Array.from({ length: PARTICIPANT_MUSIC_VOLUME.maxStored }, (_, index) => [`u${index}`, 0.5])
    );

    const next = writeParticipantMusicVolume({ identity: 'new', volume: 0.2, volumes });

    expect(Object.keys(next)).toHaveLength(PARTICIPANT_MUSIC_VOLUME.maxStored);
    expect(next.new).toBe(0.2);
    expect(next.u0).toBeUndefined();
  });
});
