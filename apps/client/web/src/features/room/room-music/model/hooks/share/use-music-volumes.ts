import { useLocalStorage } from '@siberiacancode/reactuse';

import { STORAGE_KEYS } from '@/shared/constants';

import type { MusicVolumeMap } from '../../../lib/index';

export const useMusicVolumes = () => {
  const { value, set } = useLocalStorage<MusicVolumeMap>(STORAGE_KEYS.participantMusicVolumes, {});

  return { volumes: value ?? {}, setVolumes: set };
};
