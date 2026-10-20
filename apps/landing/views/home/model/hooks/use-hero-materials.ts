'use client';

import { useEffect, useMemo } from 'react';
import { MeshToonMaterial } from 'three';

import type { HeroMaterials } from '../types';

import { HERO_SCENE_COLORS } from '../../config';
import { createToonGradient } from '../../lib';

const buildMaterials = (): HeroMaterials => {
  const gradientMap = createToonGradient();
  const entries = Object.entries(HERO_SCENE_COLORS).map(([name, color]) => [
    name,
    new MeshToonMaterial({ color, gradientMap })
  ]);

  return Object.fromEntries(entries) as HeroMaterials;
};

export const useHeroMaterials = (): HeroMaterials => {
  const materials = useMemo(buildMaterials, []);

  useEffect(
    () => () => {
      Object.values(materials).forEach((material) => {
        material.gradientMap?.dispose();
        material.dispose();
      });
    },
    [materials]
  );

  return materials;
};
