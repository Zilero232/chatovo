'use client';

import type { Group } from 'three';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { MathUtils } from 'three';

import { HERO_SCENE_GEOMETRY, HERO_SCENE_MOTION } from '../../../../../config';
import { useHeroMaterial } from '../../../../../model/contexts';
import { useSceneTime } from '../../../../../model/hooks';
import { ChatoFace } from '../ChatoFace/ChatoFace';
import { ChatoHeadphones } from '../ChatoHeadphones/ChatoHeadphones';
import { ChatoTail } from '../ChatoTail/ChatoTail';

export const ChatoModel = () => {
  const fur = useHeroMaterial('fur');
  const belly = useHeroMaterial('belly');
  const ear = useHeroMaterial('ear');

  const timeRef = useSceneTime();

  const bodyRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);

  useFrame(({ pointer }, delta) => {
    const head = headRef.current;
    const body = bodyRef.current;
    const ease = 1 - Math.exp(-HERO_SCENE_MOTION.followEase * delta);

    if (head) {
      head.rotation.y = MathUtils.lerp(
        head.rotation.y,
        pointer.x * HERO_SCENE_MOTION.headTurn,
        ease
      );
      head.rotation.x = MathUtils.lerp(
        head.rotation.x,
        -pointer.y * HERO_SCENE_MOTION.headTilt,
        ease
      );
    }

    if (body) {
      body.position.y =
        Math.sin(timeRef.current * HERO_SCENE_MOTION.bobSpeed) * HERO_SCENE_MOTION.bobHeight;
    }
  });

  return (
    <group ref={bodyRef}>
      <mesh material={fur} position={[0, -0.35, 0]} scale={[1, 0.92, 0.88]}>
        <sphereGeometry args={[1, 40, 32]} />
      </mesh>
      <mesh material={belly} position={[0, -0.38, 0.42]} scale={[0.62, 0.66, 0.5]}>
        <sphereGeometry args={[1, 32, 24]} />
      </mesh>
      {[-0.42, 0.42].map((x) => (
        <mesh key={x} material={fur} position={[x, -1.2, 0.55]} scale={[1, 0.6, 1.2]}>
          <sphereGeometry args={[0.24, 20, 16]} />
        </mesh>
      ))}
      <ChatoTail />
      <group ref={headRef} position={[0, 1.15, 0]}>
        <mesh material={fur} scale={[1.08, 0.94, 0.96]}>
          <sphereGeometry args={[0.95, 40, 32]} />
        </mesh>
        {[-HERO_SCENE_GEOMETRY.earX, HERO_SCENE_GEOMETRY.earX].map((x) => (
          <group key={x} position={[x, 0.78, 0]} rotation={[0, 0, x > 0 ? -0.38 : 0.38]}>
            <mesh material={fur}>
              <coneGeometry args={[0.32, 0.62, 24]} />
            </mesh>
            <mesh material={ear} position={[0, -0.04, 0.12]} scale={[0.6, 0.7, 0.4]}>
              <coneGeometry args={[0.32, 0.62, 24]} />
            </mesh>
          </group>
        ))}
        <ChatoFace />
        <ChatoHeadphones />
      </group>
    </group>
  );
};
