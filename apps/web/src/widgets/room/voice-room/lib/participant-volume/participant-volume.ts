import { Track } from 'livekit-client';
import { clamp, pick, takeLast } from 'remeda';

import type { MuteMap, VolumeMap, VolumeSource } from './participant-volume.types';

import { MAX_STORED_VOLUMES, MAX_VOLUME } from '../../config';

export const capMutes = (mutes: MuteMap): MuteMap => {
  const keys = Object.keys(mutes);

  if (keys.length <= MAX_STORED_VOLUMES) {
    return mutes;
  }

  return pick(mutes, takeLast(keys, MAX_STORED_VOLUMES));
};

export const capVolumes = (volumes: VolumeMap): VolumeMap => {
  const keys = Object.keys(volumes);

  if (keys.length <= MAX_STORED_VOLUMES) {
    return volumes;
  }

  return pick(volumes, takeLast(keys, MAX_STORED_VOLUMES));
};

export const buildVolumeStorageKey = (identity: string, source: VolumeSource) =>
  source === Track.Source.Microphone ? identity : `${identity}:${source}`;

export const clampVolume = (value: number) => clamp(value, { min: 0, max: MAX_VOLUME });
