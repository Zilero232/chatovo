import { describe, expect, it } from 'vitest';

import { resolveVolumeKey } from '../resolve-volume-key';

describe('resolveVolumeKey', () => {
  it('nudges the volume up and down with the horizontal arrows', () => {
    expect(resolveVolumeKey({ canMute: true, key: 'ArrowRight', volume: 0.5 })).toEqual({
      type: 'volume',
      volume: 0.55
    });
    expect(resolveVolumeKey({ canMute: true, key: 'ArrowLeft', volume: 0.5 })).toEqual({
      type: 'volume',
      volume: 0.45
    });
  });

  it('keeps the volume inside its range at both ends', () => {
    expect(resolveVolumeKey({ canMute: true, key: 'ArrowRight', volume: 1 })).toEqual({
      type: 'volume',
      volume: 1
    });
    expect(resolveVolumeKey({ canMute: true, key: 'ArrowLeft', volume: 0.02 })).toEqual({
      type: 'volume',
      volume: 0
    });
  });

  it('toggles mute on Enter and Space only when the row can mute', () => {
    expect(resolveVolumeKey({ canMute: true, key: 'Enter', volume: 0.5 })).toEqual({
      type: 'toggleMute'
    });
    expect(resolveVolumeKey({ canMute: true, key: ' ', volume: 0.5 })).toEqual({
      type: 'toggleMute'
    });
    expect(resolveVolumeKey({ canMute: false, key: 'Enter', volume: 0.5 })).toBeNull();
  });

  it('leaves every other key to the menu', () => {
    expect(resolveVolumeKey({ canMute: true, key: 'ArrowDown', volume: 0.5 })).toBeNull();
  });
});
