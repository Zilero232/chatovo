import type { SoundboardSound } from '@chatovo/schemas';

import { SOUNDBOARD_SOUNDS } from '@chatovo/schemas';

export const SOUNDBOARD_SOUND_SRC: Record<SoundboardSound, string> = {
  siren: '/audios/soundboard/siren.ogg',
  airhorn: '/audios/soundboard/airhorn.ogg',
  drumroll: '/audios/soundboard/drumroll.ogg',
  sadTrombone: '/audios/soundboard/sad-trombone.ogg',
  applause: '/audios/soundboard/applause.mp3'
};

export const SOUNDBOARD_SOUND_MAX_SECONDS: Record<SoundboardSound, number> = {
  siren: 2.5,
  airhorn: 2,
  drumroll: 3.5,
  sadTrombone: 4,
  applause: 4
};

export const SOUNDBOARD_SOUND_EMOJI: Record<SoundboardSound, string> = {
  siren: '🚨',
  airhorn: '📢',
  drumroll: '🥁',
  sadTrombone: '🎺',
  applause: '👏'
};

export { SOUNDBOARD_SOUNDS };
