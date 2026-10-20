'use client';

import type { Mesh } from 'three';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { HERO_SCENE_GEOMETRY, HERO_SCENE_MOTION } from '../../../../../config';
import { nextBlinkDelay } from '../../../../../lib';
import { useHeroMaterial } from '../../../../../model/contexts';
import { useSceneTime } from '../../../../../model/hooks';

export const ChatoFace = () => {
  const ink = useHeroMaterial('ink');
  const belly = useHeroMaterial('belly');
  const coral = useHeroMaterial('coral');

  const timeRef = useSceneTime();

  const eyesRef = useRef<Mesh[]>([]);
  const nextBlinkRef = useRef<number | null>(null);

  useFrame(() => {
    const nowMs = timeRef.current * 1000;
    const blinkAt = nextBlinkRef.current ?? nowMs + nextBlinkDelay(Math.random());
    const blinkEnd = blinkAt + HERO_SCENE_MOTION.blinkMs;
    const isClosed = nowMs > blinkAt && nowMs < blinkEnd;

    nextBlinkRef.current = nowMs > blinkEnd ? nowMs + nextBlinkDelay(Math.random()) : blinkAt;

    eyesRef.current.forEach((eye) => eye.scale.set(1, isClosed ? 0.12 : 1, 1));
  });

  return (
    <group position={[0, 0.02, 0.86]}>
      {[-HERO_SCENE_GEOMETRY.eyeX, HERO_SCENE_GEOMETRY.eyeX].map((x, index) => (
        <group key={x} position={[x, 0.08, 0]}>
          <mesh
            ref={(node) => {
              if (node) {
                eyesRef.current[index] = node;
              }
            }}
            material={ink}
          >
            <sphereGeometry args={[0.12, 20, 16]} />
          </mesh>
          <mesh material={belly} position={[0.04, 0.05, 0.1]}>
            <sphereGeometry args={[0.035, 10, 8]} />
          </mesh>
        </group>
      ))}
      <mesh material={ink} position={[0, -0.12, 0.06]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.07, 0.08, 3]} />
      </mesh>
      <mesh material={ink} position={[0, -0.24, 0.02]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.1, 0.022, 8, 24, Math.PI]} />
      </mesh>
      {[-0.52, 0.52].map((x) => (
        <mesh key={x} material={coral} position={[x, -0.12, -0.08]} scale={[1, 0.6, 0.4]}>
          <sphereGeometry args={[0.11, 16, 12]} />
        </mesh>
      ))}
    </group>
  );
};
