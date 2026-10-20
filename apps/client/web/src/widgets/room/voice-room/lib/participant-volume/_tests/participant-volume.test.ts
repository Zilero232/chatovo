import { Track } from 'livekit-client';
import { describe, expect, it } from 'vitest';

import { MAX_STORED_VOLUMES } from '../../../config';
import { buildVolumeStorageKey, capMutes, capVolumes, clampVolume } from '../participant-volume';

describe('buildVolumeStorageKey', () => {
  it('keeps the bare identity for the microphone so volumes saved before screen share still load', () => {
    expect(buildVolumeStorageKey('user-1', Track.Source.Microphone)).toBe('user-1');
  });

  it('namespaces screen-share audio so it never overwrites the microphone volume', () => {
    const key = buildVolumeStorageKey('user-1', Track.Source.ScreenShareAudio);

    expect(key).not.toBe('user-1');
    expect(key).toContain('user-1');
  });
});

describe('capVolumes', () => {
  it('leaves a map that fits under the cap untouched', () => {
    const volumes = { a: 0.5, b: 0.2 };

    expect(capVolumes(volumes)).toBe(volumes);
  });

  it('keeps the newest entries once the cap is exceeded', () => {
    const volumes = Object.fromEntries(
      Array.from({ length: MAX_STORED_VOLUMES + 5 }, (_, i) => [`user-${i}`, 0.5])
    );

    const capped = capVolumes(volumes);

    expect(Object.keys(capped)).toHaveLength(MAX_STORED_VOLUMES);
    expect(capped).toHaveProperty(`user-${MAX_STORED_VOLUMES + 4}`);
    expect(capped).not.toHaveProperty('user-0');
  });
});

describe('clampVolume', () => {
  it('holds the value inside the slider range', () => {
    expect(clampVolume(-1)).toBe(0);
    expect(clampVolume(5)).toBe(1);
    expect(clampVolume(0.4)).toBe(0.4);
  });
});

describe('capMutes', () => {
  it('leaves a map that fits under the cap untouched', () => {
    const mutes = { a: true, b: true } as const;

    expect(capMutes(mutes)).toBe(mutes);
  });

  it('keeps the newest entries once the cap is exceeded', () => {
    const mutes = Object.fromEntries(
      Array.from({ length: MAX_STORED_VOLUMES + 3 }, (_, i) => [`user-${i}`, true as const])
    );

    const capped = capMutes(mutes);

    expect(Object.keys(capped)).toHaveLength(MAX_STORED_VOLUMES);
    expect(capped).not.toHaveProperty('user-0');
  });
});
