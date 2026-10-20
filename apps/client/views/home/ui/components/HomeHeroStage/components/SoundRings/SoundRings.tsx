'use client';

import type { Mesh, MeshBasicMaterial } from 'three';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { HERO_SCENE_COLORS, HERO_SCENE_MOTION } from '../../../../../config';
import { useSceneTime } from '../../../../../model/hooks';

const RING_COLORS = [HERO_SCENE_COLORS.sun, HERO_SCENE_COLORS.coral, HERO_SCENE_COLORS.cushionTrim];

export const SoundRings = () => {
  const timeRef = useSceneTime();

  const ringsRef = useRef<Mesh[]>([]);

  useFrame(() => {
    const { ringPeriod, ringCount, ringGrowth, ringOpacity } = HERO_SCENE_MOTION;

    ringsRef.current.forEach((ring, index) => {
      const phase = (((timeRef.current / ringPeriod + index / ringCount) % 1) + 1) % 1;
      const material = ring.material as MeshBasicMaterial;

      ring.scale.setScalar(1 + phase * ringGrowth);
      material.opacity = (1 - phase) ** 2 * ringOpacity;
    });
  });

  return (
    <group position={[0, 1.15, -0.4]}>
      {RING_COLORS.map((color, index) => (
        <mesh
          key={color}
          ref={(node) => {
            if (node) {
              ringsRef.current[index] = node;
            }
          }}
        >
          <torusGeometry args={[1.45, 0.025, 8, 96]} />
          <meshBasicMaterial transparent color={color} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};
