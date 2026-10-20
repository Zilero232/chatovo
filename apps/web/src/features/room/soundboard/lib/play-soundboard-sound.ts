import type { SoundboardSound } from '@chatovo/schemas';

import { createSoundPlayer } from '@/shared/lib';

import { SOUNDBOARD_SOUND_MAX_SECONDS, SOUNDBOARD_SOUND_SRC } from '../config/sounds';

const player = createSoundPlayer<SoundboardSound>({
  sources: SOUNDBOARD_SOUND_SRC,
  defaultVolume: 0.6
});

const stopListeners = new Map<SoundboardSound, () => void>();

const armStop = (audio: HTMLAudioElement, sound: SoundboardSound) => {
  const previous = stopListeners.get(sound);

  if (previous) {
    audio.removeEventListener('timeupdate', previous);
  }

  const limit = SOUNDBOARD_SOUND_MAX_SECONDS[sound];

  const stopWhenElapsed = () => {
    if (audio.currentTime < limit) {
      return;
    }

    audio.pause();
    audio.removeEventListener('timeupdate', stopWhenElapsed);
    stopListeners.delete(sound);
  };

  stopListeners.set(sound, stopWhenElapsed);
  audio.addEventListener('timeupdate', stopWhenElapsed);
};

export const playSoundboardSound = (sound: SoundboardSound, volume?: number) => {
  const audio = player.get(sound);

  armStop(audio, sound);
  player.play(sound, volume);
};
