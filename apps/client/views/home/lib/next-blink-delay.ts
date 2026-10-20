import { HERO_SCENE_MOTION } from '../config';

export const nextBlinkDelay = (random: number): number => {
  const [min, max] = HERO_SCENE_MOTION.blinkEveryMs;

  return min + (max - min) * random;
};
