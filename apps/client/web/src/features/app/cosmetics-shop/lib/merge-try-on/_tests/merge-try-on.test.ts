import type { EquippedCosmetics } from '@chatovo/schemas';

import { describe, expect, it } from 'vitest';

import { mergeTryOn } from '../merge-try-on';

const EQUIPPED: EquippedCosmetics = {
  speakingRing: 'mint-ring',
  avatarFrame: null,
  nameStyle: null,
  tileBackground: null
};

describe('mergeTryOn', () => {
  it('returns what is equipped when nothing is being tried on', () => {
    expect(mergeTryOn({ equipped: EQUIPPED, tryOn: null })).toBe(EQUIPPED);
  });

  it('swaps only the slot of a single item', () => {
    expect(mergeTryOn({ equipped: EQUIPPED, tryOn: 'holo-frame' })).toEqual({
      ...EQUIPPED,
      avatarFrame: 'holo-frame'
    });
  });

  it('fills every slot with the set when a bundle is tried on', () => {
    expect(mergeTryOn({ equipped: EQUIPPED, tryOn: 'bundle-royal' })).toEqual({
      speakingRing: 'royal-ring',
      avatarFrame: 'royal-frame',
      nameStyle: 'royal-name',
      tileBackground: 'royal-tile'
    });
  });
});
