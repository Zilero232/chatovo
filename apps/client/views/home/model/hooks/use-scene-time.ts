'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { HERO_SCENE_MOTION } from '../../config';

export const useSceneTime = () => {
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += Math.min(delta, HERO_SCENE_MOTION.maxFrameDelta);
  });

  return timeRef;
};
