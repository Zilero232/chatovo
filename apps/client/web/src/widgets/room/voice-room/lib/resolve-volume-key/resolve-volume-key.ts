import { round } from 'remeda';

import type { ResolveVolumeKeyInput, VolumeKeyAction } from './resolve-volume-key.types';

import { VOLUME_KEY_STEP } from '../../config';
import { clampVolume } from '../participant-volume';

const NUDGE_BY_KEY: Record<string, number> = {
  ArrowRight: VOLUME_KEY_STEP,
  ArrowLeft: -VOLUME_KEY_STEP
};

const MUTE_KEYS = new Set(['Enter', ' ']);

export const resolveVolumeKey = ({
  canMute,
  key,
  volume
}: ResolveVolumeKeyInput): VolumeKeyAction | null => {
  const nudge = NUDGE_BY_KEY[key];

  if (nudge !== undefined) {
    return { type: 'volume', volume: clampVolume(round(volume + nudge, 2)) };
  }

  if (canMute && MUTE_KEYS.has(key)) {
    return { type: 'toggleMute' };
  }

  return null;
};
