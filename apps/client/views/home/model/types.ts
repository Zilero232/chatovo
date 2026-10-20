import type { ReactNode } from 'react';
import type { MeshToonMaterial } from 'three';

import type { HERO_SCENE_COLORS } from '../config';

export type HeroMaterials = Record<keyof typeof HERO_SCENE_COLORS, MeshToonMaterial>;

export type HeroMaterialsProviderProps = {
  children: ReactNode;
};
