import { DataTexture, NearestFilter, RedFormat } from 'three';

import { HERO_TOON_STEPS } from '../config';

export const createToonGradient = (): DataTexture => {
  const texture = new DataTexture(
    new Uint8Array(HERO_TOON_STEPS),
    HERO_TOON_STEPS.length,
    1,
    RedFormat
  );

  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;
  texture.needsUpdate = true;

  return texture;
};
