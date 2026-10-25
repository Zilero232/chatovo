import { PARTICIPANT_MUSIC_VOLUME } from '../../../config/music';
import { writeParticipantMusicVolume } from '../../../lib/index';
import { useMusicVolumes } from './use-music-volumes';

export const useParticipantMusicVolume = (identity: string) => {
  const { volumes, setVolumes } = useMusicVolumes();

  const volume = volumes[identity] ?? PARTICIPANT_MUSIC_VOLUME.default;

  const setVolume = (next: number) => {
    setVolumes(writeParticipantMusicVolume({ identity, volume: next, volumes }));
  };

  return { volume, setVolume };
};
