'use client';

import type { Mesh } from 'three';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { CatmullRomCurve3, Vector3 } from 'three';

import { HERO_SCENE_MOTION } from '../../../../../config';
import { useHeroMaterial } from '../../../../../model/contexts';
import { useSceneTime } from '../../../../../model/hooks';

const TAIL_POINTS = [
  new Vector3(0.6, -1.0, -0.5),
  new Vector3(1.35, -0.85, -0.55),
  new Vector3(1.55, -0.2, -0.5),
  new Vector3(1.3, 0.2, -0.45)
];

export const ChatoTail = () => {
  const fur = useHeroMaterial('fur');

  const timeRef = useSceneTime();

  const tailRef = useRef<Mesh>(null);

  const curve = useMemo(() => new CatmullRomCurve3(TAIL_POINTS), []);

  useFrame(() => {
    if (tailRef.current) {
      tailRef.current.rotation.y =
        Math.sin(timeRef.current * HERO_SCENE_MOTION.tailSpeed) * HERO_SCENE_MOTION.tailSwing;
    }
  });

  return (
    <mesh ref={tailRef} material={fur}>
      <tubeGeometry args={[curve, 32, 0.13, 12, false]} />
    </mesh>
  );
};
