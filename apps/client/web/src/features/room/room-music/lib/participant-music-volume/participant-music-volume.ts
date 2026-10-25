import { clamp, omit, pick, takeLast } from 'remeda';

import type {
  MusicVolumeMap,
  ReadParticipantMusicVolumeInput,
  WriteParticipantMusicVolumeInput
} from './participant-music-volume.types';

import { PARTICIPANT_MUSIC_VOLUME } from '../../config/music';

export const readParticipantMusicVolume = ({
  identity,
  isBlocked,
  volumes
}: ReadParticipantMusicVolumeInput) => {
  if (isBlocked) {
    return 0;
  }

  return volumes[identity] ?? PARTICIPANT_MUSIC_VOLUME.default;
};

export const writeParticipantMusicVolume = ({
  identity,
  volume,
  volumes
}: WriteParticipantMusicVolumeInput): MusicVolumeMap => {
  const next = clamp(volume, { min: 0, max: PARTICIPANT_MUSIC_VOLUME.max });
  const rest = omit(volumes, [identity]);

  if (next === PARTICIPANT_MUSIC_VOLUME.default) {
    return rest;
  }

  const keys = [...Object.keys(rest), identity];

  return pick({ ...rest, [identity]: next }, takeLast(keys, PARTICIPANT_MUSIC_VOLUME.maxStored));
};
