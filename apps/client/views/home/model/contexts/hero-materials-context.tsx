'use client';

import type { MeshToonMaterial } from 'three';

import { createContext, use } from 'react';

import type { HeroMaterials, HeroMaterialsProviderProps } from '../types';

import { useHeroMaterials } from '../hooks';

const HeroMaterialsContext = createContext<HeroMaterials | null>(null);

export const HeroMaterialsProvider = ({ children }: HeroMaterialsProviderProps) => {
  const materials = useHeroMaterials();

  return <HeroMaterialsContext value={materials}>{children}</HeroMaterialsContext>;
};

export const useHeroMaterial = (name: keyof HeroMaterials): MeshToonMaterial => {
  const materials = use(HeroMaterialsContext);

  if (!materials) {
    throw new Error('useHeroMaterial must be used within HeroMaterialsProvider');
  }

  return materials[name];
};
