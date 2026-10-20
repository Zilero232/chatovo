import { createSoundPlayer } from '@/shared/lib';

const EGG_SOUND_SRC = {
  achievement: '/audios/easter-eggs/achievement.ogg',
  unlock: '/audios/easter-eggs/unlock.ogg',
  fail: '/audios/easter-eggs/fail.ogg',
  secret: '/audios/easter-eggs/secret.ogg'
} as const;

export type EggSound = keyof typeof EGG_SOUND_SRC;

const player = createSoundPlayer<EggSound>({ sources: EGG_SOUND_SRC, defaultVolume: 0.4 });

export const playEggSound = (sound: EggSound, volume?: number) => {
  player.play(sound, volume);
};
